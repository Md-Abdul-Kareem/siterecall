import { NextRequest, NextResponse } from "next/server";
import { hindsight, hindsightAuditLogs } from "@/lib/hindsight";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { incidentId, command, postMortem } = body;

    // Simulate safe runbook execution
    const executionOutput = [
      `$ ${command || "kubectl patch sidecar && rollout restart"}`,
      "[INFO] Authenticated to cluster production-ap-south-1 with SRE admin token",
      "[INFO] Verifying socket connection pool metrics...",
      "[APPLIED] ConfigMap updated successfully (exit_code: 0)",
      "[VERIFIED] Pod sidecar rolled out in 18.2s. Zero in-flight transactions dropped.",
      "[HEALTHCHECK] HTTP GET /healthz returned 200 OK across all pods.",
      `[SRE ACTION] Incident ${incidentId || "INC-8821"} marked MITIGATED.`
    ];

    // Call Hindsight RETAIN to store the resolution & post-mortem in the memory bank
    await hindsight.retain(
      incidentId || "INC-8821",
      command || "Executed hot patch runbook",
      postMortem || "Resolved without pod restart. Zero transaction drops."
    );

    return NextResponse.json({
      success: true,
      executionOutput,
      retainedInHindsight: true,
      auditLogs: hindsightAuditLogs.slice(0, 10)
    });
  } catch (error: any) {
    console.error("API /api/incident/resolve error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
