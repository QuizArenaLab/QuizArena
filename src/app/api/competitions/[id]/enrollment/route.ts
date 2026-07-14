import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RegistrationState } from "@/generated/prisma";
import { auth } from "@/auth/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id: competitionId } = await params;
    const userId = session.user.id;

    const registration = await prisma.registration.findUnique({
      where: { userId_competitionId: { userId, competitionId } },
    });

    if (!registration) {
      return NextResponse.json({ status: RegistrationState.NOT_REGISTERED });
    }

    return NextResponse.json({
      status: registration.state,
      registrationId: registration.id,
      enrolledAt: registration.enrolledAt,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
