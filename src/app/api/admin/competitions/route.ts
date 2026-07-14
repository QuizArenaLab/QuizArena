import { NextRequest, NextResponse } from "next/server";
import { competitionService } from "@/features/competitions/services/competition.service";
import { createCompetitionSchema } from "@/features/competitions/validators/competition.schema";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await competitionService.getCompetitions(page, limit);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = createCompetitionSchema.parse(body);

    const competition = await competitionService.createCompetition(parsedData);
    return NextResponse.json(competition, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation Error", details: (error as any).errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
