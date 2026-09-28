import { NextResponse } from "next/server";
import { hindsight, hindsightAuditLogs } from "@/lib/hindsight";

export async function GET() {
  try {
    const reflections = await hindsight.reflect();
    return NextResponse.json({
      success: true,
      reflections,
      auditLogs: hindsightAuditLogs.slice(0, 10)
    });
  } catch (error: any) {
    console.error("API /api/incident/reflect error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
