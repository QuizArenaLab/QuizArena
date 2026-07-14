import { NextRequest, NextResponse } from "next/server";
import { sessionService } from "@/features/competitions/services/session.service";

const MOCK_USER_ID = "clzkr123dummyuser";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: competitionId } = await params;
    const userId = MOCK_USER_ID;

    const session = await sessionService.startSession(userId, competitionId);
    return NextResponse.json(session, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
