"use server";

import { requireAdmin } from "@/features/rbac/constants/authorization";
import { prisma } from "@/lib/prisma";
import { createOrUpdateSchedule, cancelSchedule } from "../services/scheduling.service";
import { emitPublishingEvent } from "../../events/domain-events";
import { runValidationEngine } from "../../validation/validation-engine";
import { calculateReadinessScore } from "../../validation/readiness-calculator";
import { CompetitionService } from "../../../services/competition.service";
import { createAuditEntry } from "../../audit/services/audit.service";
import { CreateScheduleConfig } from "../types/scheduling.types";

export async function scheduleCompetition(competitionId: string, config: CreateScheduleConfig) {
  const user = await requireAdmin();
  if (!user) throw new Error("Unauthorized");

  const competition = await CompetitionService.getCompetitionById(competitionId);
  if (!competition) throw new Error("Competition not found");

  if (competition.status !== "READY" && competition.status !== "DRAFT") {
    throw new Error("Competition must be in DRAFT or READY state to schedule.");
  }

  // Validate
  const validationReport = runValidationEngine(competition);
  if (calculateReadinessScore(validationReport).level === "BLOCKED") {
    throw new Error("Cannot schedule due to blocking validation errors.");
  }

  await prisma.$transaction(async (tx) => {
    await createOrUpdateSchedule(competitionId, user.id, config);

    await tx.competition.update({
      where: { id: competitionId },
      data: {
        status: "SCHEDULED",
        scheduledPublishAt: config.publishAt,
        scheduledExpiryAt: config.expiresAt,
      },
    });

    await tx.competitionAudit.create({
      data: {
        competitionId,
        action: "SCHEDULED",
        actorId: user.id,
        previousState: competition.status,
        newState: "SCHEDULED",
      },
    });
  });

  emitPublishingEvent({
    type: "COMPETITION_SCHEDULED",
    competitionId,
    scheduledFor: config.publishAt?.toISOString() || "",
  });

  return { success: true };
}

export async function cancelScheduledPublish(competitionId: string) {
  const user = await requireAdmin();
  if (!user) throw new Error("Unauthorized");

  await prisma.$transaction(async (tx) => {
    await cancelSchedule(competitionId);

    await tx.competition.update({
      where: { id: competitionId },
      data: {
        status: "READY",
        scheduledPublishAt: null,
        scheduledExpiryAt: null,
      },
    });

    await tx.competitionAudit.create({
      data: {
        competitionId,
        action: "UPDATED",
        actorId: user.id,
        previousState: "SCHEDULED",
        newState: "READY",
        reason: "Scheduled publish cancelled",
      },
    });
  });

  return { success: true };
}
