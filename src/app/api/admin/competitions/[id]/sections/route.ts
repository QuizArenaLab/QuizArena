import { NextRequest, NextResponse } from "next/server";
import { managementService } from "@/features/competitions/services/management.service";
import { createCompetitionSectionSchema } from "@/features/competitions/validators/competition.schema";
import { ZodError } from "zod";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sections = await managementService.getSections(id);
    return NextResponse.json({ data: sections });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = createCompetitionSectionSchema.parse(body);
    const section = await managementService.createSection(id, validated);
    return NextResponse.json({ data: section }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: (error as ZodError).issues },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
