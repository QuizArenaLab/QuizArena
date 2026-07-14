import { NextRequest, NextResponse } from "next/server";
import { managementService } from "@/features/competitions/services/management.service";
import { updateCompetitionEconomicsSchema } from "@/features/competitions/validators/competition.schema";
import { ZodError } from "zod";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const economics = await managementService.getEconomics(id);
    return NextResponse.json({ data: economics });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = updateCompetitionEconomicsSchema.parse(body);
    const economics = await managementService.updateEconomics(id, validated);
    return NextResponse.json({ data: economics });
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
