import { GoogleGenerativeAI } from "@google/generative-ai";
import { Incident, HindsightMemoryRecall, AgentComparisonResult } from "../types/incident";

export class GeminiAgentService {
  private genAI: GoogleGenerativeAI | null = null;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    this.modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    if (apiKey && apiKey !== "your_gemini_or_vertex_api_key_here") {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
      } catch (err) {
        console.warn("[Gemini] Failed to initialize GoogleGenerativeAI client:", err);
      }
    }
  }

  /**
   * Run the dual comparison:
   * 1. Stateless Agent (No Memory)
   * 2. INCIDEX Hindsight Memory Agent
   */
  async compareDiagnoses(incident: Incident, memory: HindsightMemoryRecall): Promise<AgentComparisonResult> {
    let statelessDiagnosis = "";
    let hindsightDiagnosis = "";

    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: this.modelName });

        // 1. Stateless Prompt (Forgets all past incidents)
        const statelessPrompt = `You are a standard DevOps assistant without access to company history.
An incident occurred in service "${incident.service}" for company "${incident.company}".
Title: ${incident.title}
Error snippet: ${incident.errorSnippet}
Telemetry: ${JSON.stringify(incident.telemetry)}

Give a brief 2-sentence generic troubleshooting recommendation.`;

        // 2. Hindsight Prompt (Empowered with historical graph memory)
        const hindsightPrompt = `You are INCIDEX, an SRE Incident Memory Agent powered by Hindsight.
Current incident: ${incident.title} in service ${incident.service}.
Telemetry: ${JSON.stringify(incident.telemetry)}

Hindsight Recalled Memory from past incident ${memory.matchedIncidentId} (solved ${memory.daysAgo} days ago by ${memory.originalResolver}):
Root Cause: ${memory.rootCause}
Critical Antipattern Warning: ${memory.criticalWarning}
Verified Runbook: ${memory.recommendedRunbook.name}

Synthesize a 2-sentence urgent incident briefing that alerts the engineer to the past solution, warns against the deadly antipattern, and references the verified fix.`;

        const [resStateless, resHindsight] = await Promise.allSettled([
          model.generateContent(statelessPrompt),
          model.generateContent(hindsightPrompt)
        ]);

        if (resStateless.status === "fulfilled") {
          statelessDiagnosis = resStateless.value.response.text();
        }
        if (resHindsight.status === "fulfilled") {
          hindsightDiagnosis = resHindsight.value.response.text();
        }
      } catch (err) {
        console.warn("[Gemini] Live API call fallback:", err);
      }
    }

    // High quality deterministic fallbacks if API key is not yet set
    if (!statelessDiagnosis) {
      if (incident.service === "payment-gateway") {
        statelessDiagnosis = "Server 504 timeout indicates backend saturation. We recommend restarting the payment-gateway pods and flushing the local redis cache to release stale socket handles.";
      } else if (incident.service === "inventory-sync") {
        statelessDiagnosis = "PostgreSQL row serialization failure detected. Run an immediate VACUUM FULL on the darkstore_inventory table and reboot the master database replica.";
      } else {
        statelessDiagnosis = "WebSocket connection timeout across rider clients. Recommend terminating the socket cluster worker pods and restarting the telemetry ingress gateway.";
      }
    }

    if (!hindsightDiagnosis) {
      hindsightDiagnosis = `Identical signature to ${memory.matchedIncidentId} (${memory.daysAgo} days ago by ${memory.originalResolver}). ${memory.criticalWarning} Execute verified runbook '${memory.recommendedRunbook.name}' to restore service in ${memory.recommendedRunbook.estimatedTimeToResolve}.`;
    }

    return {
      stateless: {
        agentName: "Stateless AI (Without Memory)",
        diagnosis: statelessDiagnosis,
        proposedAction: "Restart worker pods & flush local cache",
        dangerousPitfall: "Cascading outage! Restarts drop in-flight transactions and trigger double-billing disputes.",
        estimatedDowntime: "45 - 60 minutes",
        confidence: 0.52
      },
      hindsight: {
        agentName: "INCIDEX (With Hindsight Memory)",
        diagnosis: hindsightDiagnosis,
        recalledMemory: memory,
        actionablePlan: [
          `Recall matched Incident ${memory.matchedIncidentId} (${memory.daysAgo} days ago)`,
          `Bypass fatal antipattern: DO NOT reboot main worker pods`,
          `Execute verified safe runbook: ${memory.recommendedRunbook.name}`,
          `Restore traffic and verify p99 latency drops below 250ms`
        ],
        safeCommand: memory.recommendedRunbook.command,
        estimatedDowntime: memory.recommendedRunbook.estimatedTimeToResolve,
        confidence: memory.similarityScore
      }
    };
  }
}

export const geminiAgent = new GeminiAgentService();
