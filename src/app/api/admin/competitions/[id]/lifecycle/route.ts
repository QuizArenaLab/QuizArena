import { NextRequest, NextResponse } from "next/server";
import { lifecycleService } from "@/features/competitions/services/lifecycle.service";
import { lifecycleTransitionSchema } from "@/features/competitions/validators/lifecycle.schema";
import { competitionRepository } from "@/features/competitions/repositories/competition.repository";
import { ZodError } from "zod";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = lifecycleTransitionSchema.parse(body);

    const competition = await competitionRepository.findById(id);
    if (!competition) {
      return NextResponse.json(
        { error: "Competition not found" },
        { status: 404 }
      );
    }

    // Return valid transitions for context
    const validTransitions = lifecycleService.getValidTransitions(
      competition.lifecycleState
    );

    const result = await lifecycleService.transitionTo(
      id,
      validated.targetState,
      undefined, // performedBy — to be wired with auth
      validated.reason
    );

    return NextResponse.json({
      data: result,
      meta: { validTransitions },
    });
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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const competition = await competitionRepository.findById(id);
    if (!competition) {
      return NextResponse.json(
        { error: "Competition not found" },
        { status: 404 }
      );
    }

    const validTransitions = lifecycleService.getValidTransitions(
      competition.lifecycleState
    );

    return NextResponse.json({
      data: {
        currentState: competition.lifecycleState,
        status: competition.status,
        validTransitions,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
