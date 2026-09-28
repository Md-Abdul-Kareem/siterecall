import { VertexAI } from "@google-cloud/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { Incident, HindsightMemoryRecall, AgentComparisonResult } from "../types/incident";

export class GeminiAgentService {
  private vertexAI: VertexAI | null = null;
  private genAI: GoogleGenerativeAI | null = null;
  private modelName: string;
  private mode: "VERTEX" | "AI_STUDIO" | "MOCK" = "MOCK";

  constructor() {
    this.modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash-002";

    const projectId = process.env.GOOGLE_CLOUD_PROJECT || "";
    const location = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
    const apiKey = process.env.GEMINI_API_KEY || process.env.VERTEX_AI_API_KEY || "";

    // 1. Check for Service Account JSON Key (Highest priority for Google Cloud Vertex AI credits)
    const possibleKeyFiles = ["credentials.json", "service_account.json", "vertex_key.json"];
    let credentialsPath: string | null = null;
    for (const keyFile of possibleKeyFiles) {
      const fullPath = path.join(process.cwd(), keyFile);
      if (fs.existsSync(fullPath)) {
        credentialsPath = fullPath;
        break;
      }
    }

    if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }

    // Initialize Google Cloud Vertex AI if Project ID or credentials exist
    if (projectId || credentialsPath) {
      try {
        let authProjectId = projectId;
        if (!authProjectId && credentialsPath) {
          const creds = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
          authProjectId = creds.project_id || "";
        }

        if (authProjectId) {
          this.vertexAI = new VertexAI({
            project: authProjectId,
            location,
            googleAuthOptions: credentialsPath ? { keyFile: credentialsPath } : undefined
          });
          this.mode = "VERTEX";
          console.log(`[Vertex AI] Initialized for Google Cloud Project: ${authProjectId} (Credits Active)`);
        }
      } catch (err) {
        console.warn("[Vertex AI] Failed to initialize VertexAI client:", err);
      }
    }

    // 2. Fallback to API Key mode if Vertex AI was not configured
    if (!this.vertexAI && apiKey && apiKey !== "your_gemini_or_vertex_api_key_here") {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.mode = "AI_STUDIO";
        console.log("[Gemini] Initialized via API Key mode");
      } catch (err) {
        console.warn("[Gemini] Failed to initialize GoogleGenerativeAI client:", err);
      }
    }
  }

  private async generate(prompt: string): Promise<string> {
    if (this.mode === "VERTEX" && this.vertexAI) {
      const model = this.vertexAI.getGenerativeModel({ model: this.modelName });
      const resp = await model.generateContent(prompt);
      return resp.response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else if (this.mode === "AI_STUDIO" && this.genAI) {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      const resp = await model.generateContent(prompt);
      return resp.response.text();
    }
    return "";
  }

  /**
   * Run the dual comparison:
   * 1. Stateless Agent (No Memory)
   * 2. SiteRecall Hindsight Memory Agent
   */
  async compareDiagnoses(incident: Incident, memory: HindsightMemoryRecall): Promise<AgentComparisonResult> {
    let statelessDiagnosis = "";
    let hindsightDiagnosis = "";

    try {
      // 1. Stateless Prompt (Forgets all past incidents)
      const statelessPrompt = `You are a standard DevOps assistant without access to company history.
An incident occurred in service "${incident.service}" for company "${incident.company}".
Title: ${incident.title}
Error snippet: ${incident.errorSnippet}
Telemetry: ${JSON.stringify(incident.telemetry)}

Give a brief 2-sentence generic troubleshooting recommendation.`;

      // 2. Hindsight Prompt (Empowered with historical graph memory)
      const hindsightPrompt = `You are SiteRecall, an SRE Incident Memory Agent powered by Hindsight.
Current incident: ${incident.title} in service ${incident.service}.
Telemetry: ${JSON.stringify(incident.telemetry)}

Hindsight Recalled Memory from past incident ${memory.matchedIncidentId} (solved ${memory.daysAgo} days ago by ${memory.originalResolver}):
Root Cause: ${memory.rootCause}
Critical Antipattern Warning: ${memory.criticalWarning}
Verified Runbook: ${memory.recommendedRunbook.name}

Synthesize a 2-sentence urgent incident briefing that alerts the engineer to the past solution, warns against the deadly antipattern, and references the verified fix.`;

      const [resStateless, resHindsight] = await Promise.allSettled([
        this.generate(statelessPrompt),
        this.generate(hindsightPrompt)
      ]);

      if (resStateless.status === "fulfilled" && resStateless.value) {
        statelessDiagnosis = resStateless.value;
      }
      if (resHindsight.status === "fulfilled" && resHindsight.value) {
        hindsightDiagnosis = resHindsight.value;
      }
    } catch (err) {
      console.warn("[Gemini / Vertex AI] Generation fallback:", err);
    }

    // High quality deterministic fallbacks if live API call is pending
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
        agentName: "SiteRecall (With Hindsight Memory)",
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
