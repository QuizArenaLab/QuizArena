import { prisma } from '@/lib/prisma';
import { CompetitionLifecycle, LifecycleActorType } from '@/generated/prisma';
import { competitionHooks } from './competition-hooks.service';
import { competitionDependency } from './competition-dependency.service';
import { competitionReadiness } from './competition-readiness.service';
import { competitionVersion } from './competition-version.service';
import { eventPublisher, CompetitionEventType } from './event-publisher.service';

export class CompetitionLifecycleService {
  /**
   * Main transition pipeline
   */
  private async transition(
    competitionId: string,
    newState: CompetitionLifecycle,
    actorId?: string,
    actorType: LifecycleActorType = LifecycleActorType.SYSTEM,
    reason?: string
  ): Promise<void> {
    const competition = await prisma.competition.findUnique({ where: { id: competitionId } });
    if (!competition) throw new Error('Competition not found');

    const previousState = competition.lifecycleState;

    // 1. Before Hooks
    await this.executeBeforeHooks(previousState, newState, competitionId);

    // 2. Lifecycle Validation
    await this.validateLifecycleTransition(competitionId, previousState, newState);

    // 3. Dependency Validation
    const depResult = await competitionDependency.validateTransition(competitionId, newState);
    if (!depResult.valid) {
      throw new Error(`Dependency validation failed: ${depResult.errors.join(', ')}`);
    }

    // 4. Integrity Validation
    if (previousState === CompetitionLifecycle.LIVE && newState !== CompetitionLifecycle.COMPLETED && newState !== CompetitionLifecycle.PAUSED && newState !== CompetitionLifecycle.CANCELLED && newState !== CompetitionLifecycle.EXPIRED) {
      throw new Error('Integrity validation failed: Invalid transition from LIVE');
    }

    // 5. Database Transaction
    const now = new Date();
    await prisma.$transaction(async (tx) => {
      const updateData: any = {
        lifecycleState: newState,
        lastLifecycleUpdate: now,
        lastLifecycleActor: actorId,
      };

      // Set timestamps based on state
      if (newState === CompetitionLifecycle.READY) updateData.activatedAt = now;
      if (newState === CompetitionLifecycle.LIVE) updateData.publishedAt = now;
      if (newState === CompetitionLifecycle.COMPLETED) updateData.completedAt = now;
      if (newState === CompetitionLifecycle.EXPIRED) updateData.expiredAt = now;
      if (newState === CompetitionLifecycle.ARCHIVED) updateData.archivedAt = now;
      if (newState === CompetitionLifecycle.CANCELLED) updateData.cancelledAt = now;

      await tx.competition.update({
        where: { id: competitionId },
        data: updateData
      });

      // 7. CompetitionLifecycleAudit (Inside Transaction)
      await tx.competitionLifecycleAudit.create({
        data: {
          competitionId,
          previousState,
          newState,
          reason,
          performedBy: actorId,
          performedByType: actorType
        }
      });
    });

    // 6. CompetitionVersion Snapshot (When moving to READY)
    if (newState === CompetitionLifecycle.READY) {
      await competitionVersion.createSnapshot(competitionId, actorId);
    }

    // 8. Domain Event Publication
    const eventType = this.mapStateToEvent(newState);
    if (eventType) {
      await eventPublisher.publish(eventType, {
        competitionId,
        previousState,
        newState,
        timestamp: now,
        actorId
      });
    }

    // 9. Cache Invalidation
    await this.invalidateCaches(competitionId);

    // 10. After Hooks
    await this.executeAfterHooks(previousState, newState, competitionId);
  }

  // --- Public Operations ---

  async moveToReady(competitionId: string, actorId: string, actorType: LifecycleActorType = LifecycleActorType.ADMIN) {
    const readiness = await competitionReadiness.evaluateReadiness(competitionId);
    if (!readiness.isReady) {
      throw new Error(`Cannot transition to READY. Readiness checks failed: ${readiness.errors.join(', ')}`);
    }
    await this.transition(competitionId, CompetitionLifecycle.READY, actorId, actorType, 'Marked as Ready');
  }

  async scheduleCompetition(competitionId: string, actorId: string, actorType: LifecycleActorType = LifecycleActorType.ADMIN) {
    await this.transition(competitionId, CompetitionLifecycle.SCHEDULED, actorId, actorType, 'Scheduled');
  }

  async startCompetition(competitionId: string, actorId?: string, actorType: LifecycleActorType = LifecycleActorType.SYSTEM) {
    await this.transition(competitionId, CompetitionLifecycle.LIVE, actorId, actorType, 'Started automatically/manually');
  }

  async completeCompetition(competitionId: string, actorId?: string, actorType: LifecycleActorType = LifecycleActorType.SYSTEM) {
    await this.transition(competitionId, CompetitionLifecycle.COMPLETED, actorId, actorType, 'Completed');
  }

  async archiveCompetition(competitionId: string, actorId?: string, actorType: LifecycleActorType = LifecycleActorType.SYSTEM) {
    await this.transition(competitionId, CompetitionLifecycle.ARCHIVED, actorId, actorType, 'Archived');
  }

  async cancelCompetition(competitionId: string, reason: string, actorId: string, actorType: LifecycleActorType = LifecycleActorType.ADMIN) {
    await this.transition(competitionId, CompetitionLifecycle.CANCELLED, actorId, actorType, reason);
  }

  // --- Emergency Actions ---

  async emergencyPause(competitionId: string, reason: string, actorId: string, actorType: LifecycleActorType = LifecycleActorType.SUPER_ADMIN) {
    await this.transition(competitionId, CompetitionLifecycle.PAUSED, actorId, actorType, `EMERGENCY PAUSE: ${reason}`);
  }

  async emergencyResume(competitionId: string, reason: string, actorId: string, actorType: LifecycleActorType = LifecycleActorType.SUPER_ADMIN) {
    await this.transition(competitionId, CompetitionLifecycle.LIVE, actorId, actorType, `EMERGENCY RESUME: ${reason}`);
  }

  async emergencyTerminate(competitionId: string, reason: string, actorId: string, actorType: LifecycleActorType = LifecycleActorType.SUPER_ADMIN) {
    await this.transition(competitionId, CompetitionLifecycle.CANCELLED, actorId, actorType, `EMERGENCY TERMINATE: ${reason}`);
  }
  
  async emergencyExtend(competitionId: string, newEndTime: Date, reason: string, actorId: string, actorType: LifecycleActorType = LifecycleActorType.SUPER_ADMIN) {
    // Only extends the time, does not change state if it's currently LIVE
    await prisma.competition.update({
      where: { id: competitionId },
      data: { endsAt: newEndTime, scheduledEnd: newEndTime }
    });
    
    await prisma.competitionLifecycleAudit.create({
      data: {
        competitionId,
        newState: CompetitionLifecycle.LIVE,
        reason: `EMERGENCY EXTEND: ${reason}`,
        performedBy: actorId,
        performedByType: actorType
      }
    });
  }

  async rollbackToDraft(competitionId: string, reason: string, actorId: string, actorType: LifecycleActorType = LifecycleActorType.ADMIN) {
    // Rollback is only allowed if never actually published (e.g., from READY to DRAFT)
    await this.transition(competitionId, CompetitionLifecycle.DRAFT, actorId, actorType, `ROLLBACK: ${reason}`);
  }

  async restoreFromArchive(competitionId: string, reason: string, actorId: string, actorType: LifecycleActorType = LifecycleActorType.SUPER_ADMIN) {
    await this.transition(competitionId, CompetitionLifecycle.COMPLETED, actorId, actorType, `RESTORE: ${reason}`);
  }

  // --- Private Helpers ---

  private async validateLifecycleTransition(competitionId: string, previousState: CompetitionLifecycle, newState: CompetitionLifecycle) {
    // Simplified valid state transitions map
    const validTransitions: Record<CompetitionLifecycle, CompetitionLifecycle[]> = {
      [CompetitionLifecycle.DRAFT]: [CompetitionLifecycle.READY],
      [CompetitionLifecycle.READY]: [CompetitionLifecycle.SCHEDULED, CompetitionLifecycle.LIVE, CompetitionLifecycle.CANCELLED, CompetitionLifecycle.DRAFT],
      [CompetitionLifecycle.SCHEDULED]: [CompetitionLifecycle.LIVE, CompetitionLifecycle.EXPIRED, CompetitionLifecycle.CANCELLED, CompetitionLifecycle.DRAFT],
      [CompetitionLifecycle.LIVE]: [CompetitionLifecycle.COMPLETED, CompetitionLifecycle.PAUSED, CompetitionLifecycle.EXPIRED, CompetitionLifecycle.CANCELLED],
      [CompetitionLifecycle.PAUSED]: [CompetitionLifecycle.LIVE, CompetitionLifecycle.CANCELLED],
      [CompetitionLifecycle.COMPLETED]: [CompetitionLifecycle.ARCHIVED],
      [CompetitionLifecycle.EXPIRED]: [CompetitionLifecycle.ARCHIVED],
      [CompetitionLifecycle.ARCHIVED]: [CompetitionLifecycle.COMPLETED], // Super Admin restore
      [CompetitionLifecycle.CANCELLED]: [],
    };

    if (!validTransitions[previousState].includes(newState)) {
      throw new Error(`Invalid transition from ${previousState} to ${newState}`);
    }
  }

  private async executeBeforeHooks(oldState: CompetitionLifecycle, newState: CompetitionLifecycle, competitionId: string) {
    if (newState === CompetitionLifecycle.READY) await competitionHooks.executeHooks('beforeReady', competitionId);
    if (newState === CompetitionLifecycle.SCHEDULED) await competitionHooks.executeHooks('beforeScheduled', competitionId);
    if (newState === CompetitionLifecycle.LIVE) await competitionHooks.executeHooks('beforeLive', competitionId);
    if (newState === CompetitionLifecycle.COMPLETED) await competitionHooks.executeHooks('beforeCompleted', competitionId);
    if (newState === CompetitionLifecycle.ARCHIVED) await competitionHooks.executeHooks('beforeArchived', competitionId);
  }

  private async executeAfterHooks(oldState: CompetitionLifecycle, newState: CompetitionLifecycle, competitionId: string) {
    if (newState === CompetitionLifecycle.READY) await competitionHooks.executeHooks('afterReady', competitionId);
    if (newState === CompetitionLifecycle.SCHEDULED) await competitionHooks.executeHooks('afterScheduled', competitionId);
    if (newState === CompetitionLifecycle.LIVE) await competitionHooks.executeHooks('afterLive', competitionId);
    if (newState === CompetitionLifecycle.COMPLETED) await competitionHooks.executeHooks('afterCompleted', competitionId);
    if (newState === CompetitionLifecycle.ARCHIVED) await competitionHooks.executeHooks('afterArchived', competitionId);
  }

  private mapStateToEvent(state: CompetitionLifecycle): CompetitionEventType | null {
    const map: Record<string, CompetitionEventType> = {
      [CompetitionLifecycle.READY]: CompetitionEventType.COMPETITION_READY,
      [CompetitionLifecycle.SCHEDULED]: CompetitionEventType.COMPETITION_SCHEDULED,
      [CompetitionLifecycle.LIVE]: CompetitionEventType.COMPETITION_STARTED,
      [CompetitionLifecycle.PAUSED]: CompetitionEventType.COMPETITION_PAUSED,
      [CompetitionLifecycle.COMPLETED]: CompetitionEventType.COMPETITION_COMPLETED,
      [CompetitionLifecycle.EXPIRED]: CompetitionEventType.COMPETITION_EXPIRED,
      [CompetitionLifecycle.ARCHIVED]: CompetitionEventType.COMPETITION_ARCHIVED,
      [CompetitionLifecycle.CANCELLED]: CompetitionEventType.COMPETITION_CANCELLED,
    };
    return map[state as string] || CompetitionEventType.COMPETITION_LIFECYCLE_CHANGED;
  }

  private async invalidateCaches(competitionId: string) {
    // In a real Next.js app, we would use revalidateTag or revalidatePath
    // e.g., revalidateTag(`competition-${competitionId}`)
    console.log(`Invalidated caches for competition ${competitionId}`);
  }
}

export const competitionLifecycle = new CompetitionLifecycleService();
