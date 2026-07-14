import { NextRequest, NextResponse } from "next/server";
import { registrationService } from "@/features/revenue/services/registration.service";
import { auth } from "@/auth/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: competitionId } = await params;
    const userId = session.user.id;

    const result = await registrationService.registerForCompetition(userId, competitionId);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
