import { NextRequest, NextResponse } from "next/server";
import { lifecycleService } from "@/features/competitions/services/lifecycle.service";
import { createScheduleSchema } from "@/features/competitions/validators/lifecycle.schema";
import { ZodError } from "zod";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const schedule = await lifecycleService.getSchedule(id);
    return NextResponse.json({ data: schedule });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = createScheduleSchema.parse(body);
    const schedule = await lifecycleService.scheduleCompetition(
      id,
      validated,
      undefined // performedBy — to be wired with auth
    );
    return NextResponse.json({ data: schedule });
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
