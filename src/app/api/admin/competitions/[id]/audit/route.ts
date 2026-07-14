import { NextRequest, NextResponse } from "next/server";
import { lifecycleService } from "@/features/competitions/services/lifecycle.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auditLog = await lifecycleService.getAuditLog(id);
    return NextResponse.json({ data: auditLog });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
