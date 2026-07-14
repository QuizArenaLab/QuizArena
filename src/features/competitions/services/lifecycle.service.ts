import { competitionRepository } from "../repositories/competition.repository";
import { lifecycleRepository } from "../repositories/lifecycle.repository";
import { prisma } from "@/lib/prisma";
import {
  CompetitionLifecycle,
  CompetitionStatus,
  LifecycleActorType,
} from "@/generated/prisma";
import {
  toCompetitionDTO,
  toScheduleDTO,
  toLifecycleAuditDTO,
} from "../shared/mappers";
import type {
  CompetitionDTO,
  CompetitionScheduleDTO,
  CompetitionLifecycleAuditDTO,
  CreateScheduleDTO,
} from "../types/dto";

// ─── State Machine Definition ──────────────────────────

const VALID_TRANSITIONS: Record<CompetitionLifecycle, CompetitionLifecycle[]> = {
  [CompetitionLifecycle.DRAFT]: [
    CompetitionLifecycle.READY,
    CompetitionLifecycle.CANCELLED,
  ],
  [CompetitionLifecycle.READY]: [
    CompetitionLifecycle.SCHEDULED,
    CompetitionLifecycle.LIVE,
    CompetitionLifecycle.CANCELLED,
  ],
  [CompetitionLifecycle.SCHEDULED]: [
    CompetitionLifecycle.LIVE,
    CompetitionLifecycle.CANCELLED,
  ],
  [CompetitionLifecycle.LIVE]: [
    CompetitionLifecycle.PAUSED,
    CompetitionLifecycle.COMPLETED,
    CompetitionLifecycle.CANCELLED,
  ],
  [CompetitionLifecycle.PAUSED]: [
    CompetitionLifecycle.LIVE,
    CompetitionLifecycle.COMPLETED,
    CompetitionLifecycle.CANCELLED,
  ],
  [CompetitionLifecycle.COMPLETED]: [CompetitionLifecycle.ARCHIVED],
  [CompetitionLifecycle.EXPIRED]: [CompetitionLifecycle.ARCHIVED],
  [CompetitionLifecycle.ARCHIVED]: [],
  [CompetitionLifecycle.CANCELLED]: [],
};

const LIFECYCLE_TO_STATUS: Partial<
  Record<CompetitionLifecycle, CompetitionStatus>
> = {
  [CompetitionLifecycle.DRAFT]: CompetitionStatus.DRAFT,
  [CompetitionLifecycle.READY]: CompetitionStatus.READY,
  [CompetitionLifecycle.SCHEDULED]: CompetitionStatus.SCHEDULED,
  [CompetitionLifecycle.LIVE]: CompetitionStatus.ACTIVE,
  [CompetitionLifecycle.PAUSED]: CompetitionStatus.ACTIVE,
  [CompetitionLifecycle.COMPLETED]: CompetitionStatus.COMPLETED,
  [CompetitionLifecycle.EXPIRED]: CompetitionStatus.EXPIRED,
  [CompetitionLifecycle.ARCHIVED]: CompetitionStatus.ARCHIVED,
  [CompetitionLifecycle.CANCELLED]: CompetitionStatus.INACTIVE,
};

// ─── Lifecycle Timestamp Fields ─────────────────────────

function getTimestampField(
  state: CompetitionLifecycle
): Record<string, Date> | null {
  const now = new Date();
  switch (state) {
    case CompetitionLifecycle.LIVE:
      return { activatedAt: now };
    case CompetitionLifecycle.COMPLETED:
      return { completedAt: now };
    case CompetitionLifecycle.EXPIRED:
      return { expiredAt: now };
    case CompetitionLifecycle.ARCHIVED:
      return { archivedAt: now };
    case CompetitionLifecycle.CANCELLED:
      return { cancelledAt: now };
    default:
      return null;
  }
}

// ─── Service ────────────────────────────────────────────

export class LifecycleService {
  async transitionTo(
    competitionId: string,
    targetState: CompetitionLifecycle,
    performedBy?: string,
    reason?: string
  ): Promise<CompetitionDTO> {
    const competition = await competitionRepository.findById(competitionId);
    if (!competition) throw new Error("Competition not found");

    const currentState = competition.lifecycleState;
    const allowed = VALID_TRANSITIONS[currentState] ?? [];

    if (!allowed.includes(targetState)) {
      throw new Error(
        `Invalid transition: ${currentState} → ${targetState}. Allowed: ${allowed.join(", ") || "none"}`
      );
    }

    const newStatus =
      LIFECYCLE_TO_STATUS[targetState] ?? competition.status;
    const timestamps = getTimestampField(targetState) ?? {};

    // Atomically: update competition + create audit entry
    const [updated] = await prisma.$transaction([
      prisma.competition.update({
        where: { id: competitionId },
        data: {
          lifecycleState: targetState,
          status: newStatus,
          lastLifecycleUpdate: new Date(),
          lastLifecycleActor: performedBy ?? "SYSTEM",
          ...timestamps,
        },
      }),
      prisma.competitionLifecycleAudit.create({
        data: {
          competition: { connect: { id: competitionId } },
          previousState: currentState,
          newState: targetState,
          reason,
          performedBy,
          performedByType: performedBy
            ? LifecycleActorType.ADMIN
            : LifecycleActorType.SYSTEM,
        },
      }),
    ]);

    return toCompetitionDTO(updated);
  }

  async scheduleCompetition(
    competitionId: string,
    data: CreateScheduleDTO,
    performedBy?: string
  ): Promise<CompetitionScheduleDTO> {
    const competition = await competitionRepository.findById(competitionId);
    if (!competition) throw new Error("Competition not found");

    // Must be in READY state to schedule
    if (
      competition.lifecycleState !== CompetitionLifecycle.READY &&
      competition.lifecycleState !== CompetitionLifecycle.SCHEDULED
    ) {
      throw new Error(
        `Competition must be in READY or SCHEDULED state to schedule. Current: ${competition.lifecycleState}`
      );
    }

    const publishAt = new Date(data.publishAt);
    if (publishAt <= new Date()) {
      throw new Error("publishAt must be in the future");
    }

    // Upsert the schedule
    const schedule = await lifecycleRepository.upsertSchedule(competitionId, {
      publishAt,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      timezone: data.timezone,
    });

    // Transition to SCHEDULED if not already
    if (competition.lifecycleState !== CompetitionLifecycle.SCHEDULED) {
      await this.transitionTo(
        competitionId,
        CompetitionLifecycle.SCHEDULED,
        performedBy,
        `Scheduled to publish at ${publishAt.toISOString()}`
      );
    }

    return toScheduleDTO(schedule);
  }

  async getSchedule(
    competitionId: string
  ): Promise<CompetitionScheduleDTO | null> {
    const schedule = await lifecycleRepository.getSchedule(competitionId);
    return schedule ? toScheduleDTO(schedule) : null;
  }

  async getAuditLog(
    competitionId: string
  ): Promise<CompetitionLifecycleAuditDTO[]> {
    const audits = await lifecycleRepository.getAuditLog(competitionId);
    return audits.map(toLifecycleAuditDTO);
  }

  getValidTransitions(
    currentState: CompetitionLifecycle
  ): CompetitionLifecycle[] {
    return VALID_TRANSITIONS[currentState] ?? [];
  }
}

export const lifecycleService = new LifecycleService();
