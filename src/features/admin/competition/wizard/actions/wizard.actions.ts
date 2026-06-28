"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/rbac/constants/authorization";
import { createDraftWizardSchema } from "../validators/wizard.validators";
import { revalidatePath } from "next/cache";

/**
 * Checks if a slug is globally unique across all competitions.
 */
export async function checkSlugAvailability(
  slug: string
): Promise<{ available: boolean; suggestions?: string[] }> {
  const user = await requireAdmin();
  if (!user || !user.id) throw new Error("Unauthorized");

  const existing = await prisma.competition.findUnique({
    where: { slug },
  });

  if (!existing) {
    return { available: true };
  }

  // Generate suggestions
  const base = slug.replace(/-\d+$/, ""); // remove trailing numbers if any
  const suggestions = [
    `${base}-1`,
    `${base}-${Math.floor(Math.random() * 1000)}`,
    `${base}-${new Date().getFullYear()}`,
  ];

  return { available: false, suggestions };
}

/**
 * Validates the full wizard payload and creates a Draft Competition with its related records.
 */
export async function createDraftCompetition(payload: unknown) {
  const user = await requireAdmin();
  if (!user || !user.id) return { success: false, error: "Unauthorized" };

  const parsed = createDraftWizardSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: "Validation Failed", details: parsed.error.issues };
  }

  const { basics, config, participation } = parsed.data;

  try {
    const competitionId = await prisma.$transaction(async (tx) => {
      // 1. Create Competition Base
      const comp = await tx.competition.create({
        data: {
          title: basics.title,
          slug: basics.slug,
          description: basics.description,
          competitionType: basics.competitionType,
          exam: basics.exam,
          language: basics.language,
          difficulty: basics.difficulty,
          durationMinutes: config.durationMinutes,
          maximumMarks: config.maximumMarks,
          status: "DRAFT",
          visibility: participation.visibility,
          startsAt: participation.startsAt ? new Date(participation.startsAt) : null,
          endsAt: participation.endsAt ? new Date(participation.endsAt) : null,
          createdById: user.id,
        },
      });

      // 2. Create Config
      await tx.competitionConfig.create({
        data: {
          competitionId: comp.id,
          negativeMarkingEnabled: config.negativeMarkingEnabled,
          negativeMarkPerQuestion: config.negativeMarkPerQuestion,
          passingMarks: config.passingMarks,
          allowRetake: participation.allowRetake,
          randomizeQuestions: config.randomizeQuestions,
          randomizeOptions: config.randomizeOptions,
          rules: {
            attemptLimit: config.attemptLimit,
            reviewAllowed: config.reviewAllowed,
            bookmarkAllowed: config.bookmarkAllowed,
            sectionNavigation: config.sectionNavigation,
            calculatorAllowed: config.calculatorAllowed,
          },
        },
      });

      // 3. Create Economics
      await tx.competitionEconomics.create({
        data: {
          competitionId: comp.id,
          entryFee: 0,
          rewardPool: 0,
        },
      });

      // 4. Create Eligibility
      await tx.competitionEligibility.create({
        data: {
          competitionId: comp.id,
          maxParticipants: participation.maxParticipants,
          criteria: {
            mode: "EVERYONE",
            allowedExams: [],
            allowedInstitutions: [],
            inviteCodes: [],
          },
        },
      });

      // 5. Audit Log
      await tx.competitionAudit.create({
        data: {
          competitionId: comp.id,
          action: "CREATED",
          actorId: user.id,
          newState: "DRAFT",
          reason: "Competition created via Wizard",
        },
      });

      return comp.id;
    });

    revalidatePath("/admin/dashboard/competitions");
    return { success: true, competitionId };
  } catch (err: any) {
    if (err.code === "P2002") {
      return { success: false, error: "Slug is already in use by another competition." };
    }
    return { success: false, error: err.message || "Failed to create draft competition." };
  }
}
