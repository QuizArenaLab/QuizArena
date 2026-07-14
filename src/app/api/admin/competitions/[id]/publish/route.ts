import { NextRequest, NextResponse } from 'next/server';
import { competitionService } from '@/features/competitions/services/competition.service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const competition = await competitionService.publishCompetition(id);
    return NextResponse.json(competition);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
