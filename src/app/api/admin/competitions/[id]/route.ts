import { NextRequest, NextResponse } from "next/server";
import { competitionService } from "@/features/competitions/services/competition.service";
import { updateCompetitionSchema } from "@/features/competitions/validators/competition.schema";
import { z } from "zod";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const competition = await competitionService.getCompetitionById(id);
    if (!competition) {
      return NextResponse.json({ error: "Competition not found" }, { status: 404 });
    }
    return NextResponse.json(competition);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsedData = updateCompetitionSchema.parse(body);

    const competition = await competitionService.updateCompetition(id, parsedData);
    return NextResponse.json(competition);
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
