import { NextRequest, NextResponse } from "next/server";
import { sessionService } from "@/features/competitions/services/session.service";
import { auth } from "@/auth/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionAuth = await auth();
    if (!sessionAuth?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: competitionId } = await params;
    const userId = sessionAuth.user.id;

    const session = await sessionService.getSessionState(userId, competitionId);
    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
