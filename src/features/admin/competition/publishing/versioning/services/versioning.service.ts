import { prisma } from "@/lib/prisma";
import { CompetitionWithRelations } from "../../../types";
import { CompetitionVersionInfo } from "../types/versioning.types";

export async function getVersionHistory(competitionId: string): Promise<CompetitionVersionInfo[]> {
  const versions = await prisma.competitionVersion.findMany({
    where: { competitionId },
    orderBy: { versionNumber: "desc" },
    include: { publishedBy: { select: { id: true, name: true, email: true } } },
  });

  return versions.map((v) => ({
    id: v.id,
    versionNumber: v.versionNumber,
    publishedAt: v.publishedAt?.toISOString() || null,
    publishedBy: v.publishedBy
      ? {
          id: v.publishedBy.id,
          name: v.publishedBy.name || v.publishedBy.email || "Unknown",
        }
      : null,
    changelog: v.changelog,
    isActive: v.isActive,
    createdAt: v.createdAt.toISOString(),
  }));
}

export async function createVersionSnapshot(
  competition: CompetitionWithRelations,
  userId: string,
  changelog: string,
  tx?: any // Optional Prisma transaction client
) {
  const db = tx || prisma;

  // Get current max version
  const lastVersion = await db.competitionVersion.findFirst({
    where: { competitionId: competition.id },
    orderBy: { versionNumber: "desc" },
  });

  const nextVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

  // Deactivate existing versions
  await db.competitionVersion.updateMany({
    where: { competitionId: competition.id },
    data: { isActive: false },
  });

  // Construct structured snapshots
  const competitionSnapshot = {
    id: competition.id,
    title: competition.title,
    slug: competition.slug,
    description: competition.description,
    type: competition.competitionType,
    difficulty: competition.difficulty,
    language: competition.language,
    durationMinutes: competition.durationMinutes,
    totalQuestions: competition.totalQuestions,
    maximumMarks: competition.maximumMarks,
  };

  const sectionsSnapshot = competition.sections.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    displayOrder: s.displayOrder,
  }));

  const questionsSnapshot = competition.questions.map((q) => ({
    questionId: q.questionId,
    sectionId: q.sectionId,
    marks: q.marks,
    negativeMarks: q.negativeMarks,
    displayOrder: q.displayOrder,
    isMandatory: q.isMandatory,
  }));

  const rulesSnapshot = competition.config?.rules || {};

  const configSnapshot = {
    entryFee: competition.economics?.entryFee || null,
    rewardPool: competition.economics?.rewardPool || null,
    currency: competition.economics?.currency || "INR",
    eligibilityCriteria: competition.eligibility?.criteria || {},
  };

  const newVersion = await db.competitionVersion.create({
    data: {
      competitionId: competition.id,
      versionNumber: nextVersionNumber,
      competitionSnapshot,
      sectionsSnapshot,
      questionsSnapshot,
      rulesSnapshot,
      configSnapshot,
      changelog,
      publishedAt: new Date(),
      publishedById: userId,
      isActive: true,
    },
  });

  return newVersion;
}
