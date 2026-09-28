import { NextRequest, NextResponse } from "next/server";
import { hindsight, hindsightAuditLogs } from "@/lib/hindsight";
import { geminiAgent } from "@/lib/gemini";
import { Incident } from "@/types/incident";

let latestWebhookState: {
  incident: Incident;
  memory: any;
  comparison: any;
  timestamp: number;
} | null = null;

export async function GET() {
  return NextResponse.json({
    success: true,
    latest: latestWebhookState,
    auditLogs: hindsightAuditLogs.slice(0, 10)
  });
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => ({}));
    
    // Ingest custom payload
    const company = payload.company || "External Enterprise";
    const service = payload.service || "core-service";
    const errorText = payload.error || payload.message || "Unknown error event received";
    const severity = payload.severity || "SEV-1";
    const title = payload.title || `${company}: ${errorText.slice(0, 60)}`;

    const stackTrace = Array.isArray(payload.stackTrace)
      ? payload.stackTrace
      : typeof payload.stackTrace === "string"
      ? payload.stackTrace.split("\n")
      : [
          `[LIVE INCOMING ALERT] Source: ${req.headers.get("user-agent") || "External API"}`,
          `Error: ${errorText}`,
          `Target Service: ${service}`,
          `Host: ${req.headers.get("host") || "production"}`
        ];

    const telemetry = {
      cpuUsage: payload.telemetry?.cpuUsage || payload.cpuUsage || "88.4%",
      memoryUsage: payload.telemetry?.memoryUsage || payload.memoryUsage || "81.2%",
      errorRate: payload.telemetry?.errorRate || payload.errorRate || "47.1%",
      p99Latency: payload.telemetry?.p99Latency || payload.p99Latency || "6,200ms",
      activeConnections: payload.telemetry?.activeConnections || payload.activeConnections || 1420,
      impactSummary: payload.telemetry?.impactSummary || payload.impactSummary || `Live alert received via API webhook for ${company} (${service})`
    };

    const customIncident: Incident = {
      id: payload.id || `ALERT-${Math.floor(1000 + Math.random() * 9000)}`,
      company,
      service,
      title,
      severity,
      status: "TRIGGERED",
      timestamp: new Date().toLocaleTimeString(),
      errorSnippet: errorText,
      stackTrace,
      telemetry
    };

    // 1. Recall from Hindsight
    const memory = await hindsight.recall(service, errorText);

    // 2. Reason with Gemini 3.8 Flash
    const comparison = await geminiAgent.compareDiagnoses(customIncident, memory);

    // 3. Save latest state for live UI auto-sync
    latestWebhookState = {
      incident: customIncident,
      memory,
      comparison,
      timestamp: Date.now()
    };

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully by SiteRecall SRE Brain",
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

