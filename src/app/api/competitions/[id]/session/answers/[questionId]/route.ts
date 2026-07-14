import { NextRequest, NextResponse } from "next/server";
import { sessionService } from "@/features/competitions/services/session.service";
import { prisma } from "@/lib/prisma";

const MOCK_USER_ID = "clzkr123dummyuser";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  try {
    const { id: competitionId, questionId } = await params;
    const { selectedOptionId } = await req.json();
    const userId = MOCK_USER_ID;

    // Find the session ID for this user/competition
    const session = await prisma.competitionSession.findUnique({
      where: { userId_competitionId: { userId, competitionId } },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const answer = await sessionService.submitAnswer(session.id, questionId, selectedOptionId);
    return NextResponse.json(answer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
