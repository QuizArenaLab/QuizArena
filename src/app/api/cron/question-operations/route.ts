import { NextResponse } from "next/server";
import { runOperationsEvaluation } from "@/features/admin/services/questions/operations/engine";

export const maxDuration = 300; // 5 minutes max duration for Vercel
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // 1. Verify cron secret to ensure only authorized schedulers can trigger
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Run Operations Evaluation Pipeline
    const result = await runOperationsEvaluation();

    return NextResponse.json({
      success: true,
      data: result,
      message: `Processed ${result.processed} questions. New Issues: ${result.newIssues}. Auto-resolved: ${result.autoResolved}. Duration: ${result.durationMs}ms`,
    });

  } catch (error) {
    console.error("[CRON_OPERATIONS_ERROR]", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
