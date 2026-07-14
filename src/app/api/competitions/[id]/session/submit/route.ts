import { NextRequest, NextResponse } from 'next/server';
import { sessionService } from '@/features/competitions/services/session.service';
import { prisma } from '@/lib/prisma';

const MOCK_USER_ID = 'clzkr123dummyuser';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: competitionId } = await params;
    const userId = MOCK_USER_ID; 

    // Find the session ID for this user/competition
    const session = await prisma.competitionSession.findUnique({
      where: { userId_competitionId: { userId, competitionId } }
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const submittedSession = await sessionService.submitSession(session.id);
    return NextResponse.json(submittedSession);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
