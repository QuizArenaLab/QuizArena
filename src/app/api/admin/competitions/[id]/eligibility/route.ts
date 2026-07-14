import { NextRequest, NextResponse } from "next/server";
import { managementService } from "@/features/competitions/services/management.service";
import { updateCompetitionEligibilitySchema } from "@/features/competitions/validators/competition.schema";
import { ZodError } from "zod";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const eligibility = await managementService.getEligibility(id);
    return NextResponse.json({ data: eligibility });
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = updateCompetitionEligibilitySchema.parse(body);
    const eligibility = await managementService.updateEligibility(id, validated);
    return NextResponse.json({ data: eligibility });
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
