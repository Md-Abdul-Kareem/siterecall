import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_INCIDENTS } from "@/lib/scenarios";
import { hindsight, hindsightAuditLogs } from "@/lib/hindsight";
import { geminiAgent } from "@/lib/gemini";
import { Incident } from "@/types/incident";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { incidentId, service, customIncident } = body;

    let incident: Incident;

    if (customIncident) {
      incident = {
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        company: customIncident.company || "Custom Enterprise",
        title: customIncident.title || "Custom Alert Received via Webhook",
        service: customIncident.service || "core-api",
        severity: customIncident.severity || "SEV-1",
        status: "TRIGGERED",
        timestamp: "Just now (Live Ingest)",
        errorSnippet: customIncident.error || "Custom stack trace / error event",
        stackTrace: [
          `Error: ${customIncident.error || "Unknown critical alert"}`,
          "at LiveIngressHandler (/app/webhooks/ingress.js:42:10)",
          "at Dispatcher.routeAlert (/app/core/dispatcher.js:18:5)"
        ],
        telemetry: {
          cpuUsage: "91.5%",
          memoryUsage: "84.2%",
          errorRate: "52.8%",
          p99Latency: "9,400ms",
          activeConnections: 2950,
          impactSummary: "Active alert triggered via external webhook API."
        }
      };
    } else {
      incident = SAMPLE_INCIDENTS.find(inc => inc.id === incidentId || inc.service === service) || SAMPLE_INCIDENTS[0];
    }

    // Step 1: Query Hindsight Memory Layer
    const memory = await hindsight.recall(incident.service, incident.errorSnippet);

    // Step 2: Query Gemini 3.8 Flash for Comparative Reasoning
    const comparison = await geminiAgent.compareDiagnoses(incident, memory);

    return NextResponse.json({
      success: true,
      incident,
      memory,
      comparison,
      auditLogs: hindsightAuditLogs.slice(0, 10)
    });
  } catch (error: any) {
    console.error("API /api/incident/analyze error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
