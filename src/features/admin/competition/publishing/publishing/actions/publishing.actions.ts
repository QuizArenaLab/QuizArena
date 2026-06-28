"use server";

import { requireAdmin } from "@/features/rbac/constants/authorization";
import { prisma } from "@/lib/prisma";
import { CompetitionService } from "../../../services/competition.service";
import { runValidationEngine } from "../../validation/validation-engine";
import { calculateReadinessScore } from "../../validation/readiness-calculator";
import { generateChecklist } from "../services/publishing.service";
import { emitPublishingEvent } from "../../events/domain-events";
import { PublishingConfig, PublishWorkspaceData } from "../types/publishing.types";
import {
  getVersionHistory,
  createVersionSnapshot,
} from "../../versioning/services/versioning.service";
import { getAuditTrail, createAuditEntry } from "../../audit/services/audit.service";
import { getSchedule } from "../../scheduling/services/scheduling.service";

export async function getPublishingWorkspaceData(
  competitionId: string
): Promise<PublishWorkspaceData> {
  await requireAdmin();

  const competition = await CompetitionService.getCompetitionById(competitionId);
  if (!competition) {
    throw new Error("Competition not found");
  }

  const validationReport = runValidationEngine(competition);
  const readinessScore = calculateReadinessScore(validationReport);
  const checklist = generateChecklist(competition, validationReport);
  const versions = await getVersionHistory(competitionId);
  const auditTrail = await getAuditTrail(competitionId);
  const schedule = await getSchedule(competitionId);

  // Check locking
  const lock = await prisma.publishingLock.findUnique({
    where: { competitionId },
    include: { user: { select: { name: true, email: true } } },
  });

  let publishingLock = null;
  if (lock && lock.expiresAt > new Date()) {
    publishingLock = {
      userId: lock.userId,
      userName: lock.user?.name || lock.user?.email || "Unknown",
      acquiredAt: lock.acquiredAt.toISOString(),
      expiresAt: lock.expiresAt.toISOString(),
    };
  } else if (lock) {
    // Clean up expired lock
    await prisma.publishingLock.delete({ where: { id: lock.id } });
  }

  return {
    competition,
    validationReport,
    readinessScore,
    checklist,
    versions,
    auditTrail,
    schedule,
    publishingLock,
  };
}

export async function markCompetitionReady(competitionId: string) {
  const user = await requireAdmin();
  if (!user) throw new Error("Unauthorized");

  const competition = await CompetitionService.getCompetitionById(competitionId);
  if (!competition) throw new Error("Competition not found");

  const validationReport = runValidationEngine(competition);
  const readinessScore = calculateReadinessScore(validationReport);

  if (readinessScore.level === "BLOCKED") {
    await createAuditEntry({
      action: "VALIDATION_FAILED",
      actorId: user.id,
      competitionId,
      previousState: competition.status as any,
      newState: competition.status as any,
      metadata: { errorCount: validationReport.counts.error },
    });

    emitPublishingEvent({
      type: "VALIDATION_FAILED",
      competitionId,
      errorCount: validationReport.counts.error,
    });

    return {
      success: false,
      error: "Validation failed with blocking errors.",
      report: validationReport,
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.competition.update({
      where: { id: competitionId },
      data: { status: "READY" },
    });

    await tx.competitionAudit.create({
      data: {
        competitionId,
        action: "MARKED_READY",
        actorId: user.id,
        previousState: competition.status,
        newState: "READY",
      },
    });
  });

  return { success: true };
}

export async function publishCompetition(competitionId: string, config: PublishingConfig) {
  const user = await requireAdmin();
  if (!user) throw new Error("Unauthorized");

  // Acquire lock atomically
  try {
    await prisma.publishingLock.create({
      data: {
        competitionId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes TTL
      },
    });
  } catch (err) {
    throw new Error("Could not acquire publishing lock. Someone else may be publishing.");
  }

  let finalStatus = "LIVE";

  try {
    const competition = await CompetitionService.getCompetitionById(competitionId);
    if (!competition) throw new Error("Competition not found");

    if (competition.status !== "READY" && competition.status !== "SCHEDULED") {
      throw new Error("Competition must be READY or SCHEDULED to publish.");
    }

    // Double check validation
    const validationReport = runValidationEngine(competition);
    if (calculateReadinessScore(validationReport).level === "BLOCKED") {
      throw new Error("Validation failed. Cannot publish.");
    }

    await prisma.$transaction(
      async (tx) => {
        // 1. Transition to PUBLISHING transient state
        await tx.competition.update({
          where: { id: competitionId },
          data: { status: "PUBLISHING" },
        });

        await tx.competitionAudit.create({
          data: {
            competitionId,
            action: "PUBLISH_STARTED",
            actorId: user.id,
            previousState: competition.status,
            newState: "PUBLISHING",
          },
        });

        // 2. Create version snapshot
        const version = await createVersionSnapshot(
          competition,
          user.id,
          config.changelog,
          tx as any
        );

        // 3. Update to LIVE
        await tx.competition.update({
          where: { id: competitionId },
          data: {
            status: "LIVE",
            publishedAt: new Date(),
            version: version.versionNumber,
          },
        });

        await tx.competitionAudit.create({
          data: {
            competitionId,
            action: "PUBLISHED",
            actorId: user.id,
            previousState: "PUBLISHING",
            newState: "LIVE",
          },
        });
      },
      { timeout: 10000 }
    ); // Increase timeout for large snapshots

    emitPublishingEvent({
      type: "COMPETITION_PUBLISHED",
      competitionId,
      publishedBy: user.id,
    });
  } catch (error: any) {
    finalStatus = "READY";
    // If failed, revert to READY
    await prisma.competition.update({
      where: { id: competitionId },
      data: { status: "READY" },
    });
    await createAuditEntry({
      action: "PUBLISH_FAILED",
      actorId: user.id,
      competitionId,
      previousState: "PUBLISHING" as any,
      newState: "READY" as any,
      reason: error.message,
    });

    // Ensure lock is released even on error
    await prisma.publishingLock.deleteMany({
      where: { competitionId, userId: user.id },
    });
    throw error;
  }

  // Release lock
  await prisma.publishingLock.deleteMany({
    where: { competitionId, userId: user.id },
  });

  return { success: true };
}

export async function saveDraft(competitionId: string) {
  const user = await requireAdmin();
  if (!user) throw new Error("Unauthorized");
  // Does nothing explicitly in terms of validation, just ensures DRAFT
  await prisma.competition.update({
    where: { id: competitionId },
    data: { status: "DRAFT" },
  });
  return { success: true };
}
