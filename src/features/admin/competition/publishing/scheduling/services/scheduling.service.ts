import { prisma } from "@/lib/prisma";
import { CompetitionScheduleInfo, CreateScheduleConfig } from "../types/scheduling.types";

export async function getSchedule(competitionId: string): Promise<CompetitionScheduleInfo | null> {
  const schedule = await prisma.competitionSchedule.findUnique({
    where: { competitionId },
  });

  if (!schedule) return null;

  return {
    publishAt: schedule.publishAt?.toISOString() || null,
    expiresAt: schedule.expiresAt?.toISOString() || null,
    timezone: schedule.timezone,
    status: schedule.status as any,
    executedAt: schedule.executedAt?.toISOString() || null,
    executionLog: schedule.executionLog,
  };
}

export async function createOrUpdateSchedule(
  competitionId: string,
  userId: string,
  config: CreateScheduleConfig
) {
  const data = {
    publishAt: config.publishAt,
    expiresAt: config.expiresAt,
    timezone: config.timezone,
    status: "PENDING" as const,
    createdById: userId,
  };

  return await prisma.competitionSchedule.upsert({
    where: { competitionId },
    update: data,
    create: {
      competitionId,
      ...data,
    },
  });
}

export async function cancelSchedule(competitionId: string) {
  return await prisma.competitionSchedule.update({
    where: { competitionId },
    data: { status: "CANCELLED" },
  });
}
