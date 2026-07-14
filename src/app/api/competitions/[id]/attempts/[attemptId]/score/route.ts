import { NextRequest, NextResponse } from "next/server";
import { scoringService } from "@/features/competitions/services/scoring.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; attemptId: string }> }
) {
  try {
    const { attemptId } = await params;

    // In a real system, this might be protected by an admin token or internal microservice key.
    // For now, we simulate the automated grading trigger.
    const result = await scoringService.evaluateAttempt(attemptId);

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
