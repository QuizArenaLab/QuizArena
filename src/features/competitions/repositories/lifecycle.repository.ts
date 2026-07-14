import { prisma } from "@/lib/prisma";
import {
  CompetitionSchedule,
  CompetitionLifecycleAudit,
  CompetitionLifecycle,
  LifecycleActorType,
  ScheduleStatus,
} from "@/generated/prisma";

export class LifecycleRepository {
  // ─── Schedule ───────────────────────────────────────

  async getSchedule(
    competitionId: string
  ): Promise<CompetitionSchedule | null> {
    return prisma.competitionSchedule.findUnique({
      where: { competitionId },
    });
  }

  async upsertSchedule(
    competitionId: string,
    data: {
      publishAt: Date;
      expiresAt?: Date;
      timezone?: string;
    }
  ): Promise<CompetitionSchedule> {
    return prisma.competitionSchedule.upsert({
      where: { competitionId },
      update: {
        publishAt: data.publishAt,
        expiresAt: data.expiresAt,
        timezone: data.timezone,
        status: ScheduleStatus.PENDING,
      },
      create: {
        competition: { connect: { id: competitionId } },
        publishAt: data.publishAt,
        expiresAt: data.expiresAt,
        timezone: data.timezone ?? "Asia/Kolkata",
        status: ScheduleStatus.PENDING,
      },
    });
  }

  // ─── Lifecycle Audit ────────────────────────────────

  async createAuditEntry(data: {
    competitionId: string;
    previousState: CompetitionLifecycle | null;
    newState: CompetitionLifecycle;
    reason?: string;
    performedBy?: string;
    performedByType: LifecycleActorType;
  }): Promise<CompetitionLifecycleAudit> {
    return prisma.competitionLifecycleAudit.create({
      data: {
        competition: { connect: { id: data.competitionId } },
        previousState: data.previousState,
        newState: data.newState,
        reason: data.reason,
        performedBy: data.performedBy,
        performedByType: data.performedByType,
      },
    });
  }

  async getAuditLog(
    competitionId: string
  ): Promise<CompetitionLifecycleAudit[]> {
    return prisma.competitionLifecycleAudit.findMany({
      where: { competitionId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const lifecycleRepository = new LifecycleRepository();
