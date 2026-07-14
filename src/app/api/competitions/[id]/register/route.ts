import { NextRequest, NextResponse } from "next/server";
import { registrationService } from "@/features/revenue/services/registration.service";
// In a real app, you would import auth to get the userId.
// For this Day 2 sprint scope, we'll mock a userId.
const MOCK_USER_ID = "clzkr123dummyuser";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: competitionId } = await params;
    const userId = MOCK_USER_ID; // Replace with await auth()

    const result = await registrationService.registerForCompetition(userId, competitionId);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
