import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RegistrationState } from '@/generated/prisma';

const MOCK_USER_ID = 'clzkr123dummyuser';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: competitionId } = await params;
    const userId = MOCK_USER_ID; 

    const registration = await prisma.registration.findUnique({
      where: { userId_competitionId: { userId, competitionId } }
    });

    if (!registration) {
      return NextResponse.json({ status: RegistrationState.NOT_REGISTERED });
    }

    return NextResponse.json({
      status: registration.state,
      registrationId: registration.id,
      enrolledAt: registration.enrolledAt
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
