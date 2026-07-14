import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        economics: true,
        eligibility: true,
        config: true,
        sections: {
          orderBy: { displayOrder: 'asc' }
        }
      }
    });

    if (!competition) {
      return NextResponse.json({ error: 'Competition not found' }, { status: 404 });
    }

    return NextResponse.json(competition);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
