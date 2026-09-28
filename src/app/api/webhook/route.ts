import { NextRequest, NextResponse } from "next/server";
import { hindsight, hindsightAuditLogs } from "@/lib/hindsight";
import { geminiAgent } from "@/lib/gemini";
import { Incident } from "@/types/incident";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => ({}));
    
    // Ingest custom payload
    const company = payload.company || "External Enterprise";
    const service = payload.service || "core-service";
    const errorText = payload.error || payload.message || "Unknown error event received";
    const severity = payload.severity || "SEV-1";

    const customIncident: Incident = {
      id: `WEBHOOK-${Math.floor(1000 + Math.random() * 9000)}`,
      company,
      service,
      title: `${company}: ${errorText.slice(0, 50)}`,
      severity,
      status: "TRIGGERED",
      timestamp: new Date().toLocaleTimeString(),
      errorSnippet: errorText,
      stackTrace: [
        `[INCOMING WEBHOOK ALERT] Source: ${req.headers.get("user-agent") || "curl/api"}`,
        `Error: ${errorText}`,
        `Service target: ${service}`,
        `Cluster node: ap-south-prod-02`
      ],
      telemetry: {
        cpuUsage: "88.4%",
        memoryUsage: "81.2%",
        errorRate: "47.1%",
        p99Latency: "6,200ms",
        activeConnections: 3100,
        impactSummary: `Live alert received via public webhook for ${company} (${service})`
      }
    };

    // 1. Recall from Hindsight
    const memory = await hindsight.recall(service, errorText);

    // 2. Reason with Gemini 3.8 Flash
    const comparison = await geminiAgent.compareDiagnoses(customIncident, memory);

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully by INCIDEX SRE Brain",
      incident: customIncident,
      memory,
      comparison,
      auditLogs: hindsightAuditLogs.slice(0, 10)
    });
  } catch (error: any) {
    console.error("API /api/webhook error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
