import { NextResponse } from "next/server";
import { getOperationsDashboardMetrics } from "@/features/admin/services/questions/operations/service";

export async function GET() {
  try {
    const metrics = await getOperationsDashboardMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("[GET_METRICS_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
