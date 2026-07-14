import { NextRequest, NextResponse } from "next/server";
import { sessionService } from "@/features/competitions/services/session.service";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionAuth = await auth();
    if (!sessionAuth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: competitionId } = await params;
    const userId = sessionAuth.user.id;

    // Find the session ID for this user/competition
    const session = await prisma.competitionSession.findUnique({
      where: { userId_competitionId: { userId, competitionId } },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const submittedSession = await sessionService.submitSession(session.id);
    return NextResponse.json(submittedSession);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
