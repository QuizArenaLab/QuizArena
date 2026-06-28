import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CompetitionLifecycle, LifecycleActorType } from '@/generated/prisma';
import { competitionLifecycle } from '@/features/competitions/lifecycle/services/competition-lifecycle.service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Security check: verify this is called by a trusted cron scheduler
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  let processedCount = 0;
  const errors: string[] = [];

  try {
    // 1. READY -> SCHEDULED (if scheduledPublishAt has passed)
    // Wait, the automated transition for scheduled publishing.
    const toSchedule = await prisma.competition.findMany({
      where: {
        lifecycleState: CompetitionLifecycle.READY,
        scheduledPublishAt: { lte: now }
      }
    });

    for (const comp of toSchedule) {
      try {
        await competitionLifecycle.scheduleCompetition(comp.id, 'SYSTEM', LifecycleActorType.SYSTEM);
        processedCount++;
      } catch (e: any) {
        errors.push(`Failed to schedule ${comp.id}: ${e.message}`);
      }
    }

    // 2. SCHEDULED -> LIVE (if startsAt has passed)
    const toLive = await prisma.competition.findMany({
      where: {
        lifecycleState: CompetitionLifecycle.SCHEDULED,
        startsAt: { lte: now }
      }
    });

    for (const comp of toLive) {
      try {
        await competitionLifecycle.startCompetition(comp.id, 'SYSTEM', LifecycleActorType.SYSTEM);
        processedCount++;
      } catch (e: any) {
        errors.push(`Failed to start ${comp.id}: ${e.message}`);
      }
    }

    // 3. LIVE -> COMPLETED (if endsAt has passed)
    const toComplete = await prisma.competition.findMany({
      where: {
        lifecycleState: CompetitionLifecycle.LIVE,
        endsAt: { lte: now }
      }
    });

    for (const comp of toComplete) {
      try {
        await competitionLifecycle.completeCompetition(comp.id, 'SYSTEM', LifecycleActorType.SYSTEM);
        processedCount++;
      } catch (e: any) {
        errors.push(`Failed to complete ${comp.id}: ${e.message}`);
      }
    }

    // 4. COMPLETED -> ARCHIVED (after retention period e.g. 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const toArchive = await prisma.competition.findMany({
      where: {
        lifecycleState: CompetitionLifecycle.COMPLETED,
        completedAt: { lte: thirtyDaysAgo }
      }
    });

    for (const comp of toArchive) {
      try {
        await competitionLifecycle.archiveCompetition(comp.id, 'SYSTEM', LifecycleActorType.SYSTEM);
        processedCount++;
      } catch (e: any) {
        errors.push(`Failed to archive ${comp.id}: ${e.message}`);
      }
    }

    return NextResponse.json({ success: true, processedCount, errors });
  } catch (error: any) {
    console.error('Lifecycle Cron Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
