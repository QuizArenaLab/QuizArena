"use server";

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/session-utils';
import {
  calculateReadinessScore,
  evaluateParticipationGaps,
  calculateDisciplineIndex,
  generateDeterministicInsights,
  IntelligenceInsight,
} from '@/lib/intelligence-engine';

export async function syncPerformanceIntelligence() {
  const user = await requireAuth();

  const categories = await prisma.userCategoryPerformance.findMany({
    where: { userId: user.id },
    orderBy: { averageAccuracy: "desc" },
  });

  const difficulties = await prisma.userDifficultyPerformance.findMany({
    where: { userId: user.id },
  });

  let profile = await prisma.userPerformanceProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    profile = await prisma.userPerformanceProfile.create({
      data: { userId: user.id },
    });
  }

  const updatedGaps = evaluateParticipationGaps(
    profile.lastParticipationAt,
    profile.participationGaps
  );
  const disciplineIndex = calculateDisciplineIndex(
    profile.longestStreak,
    updatedGaps,
    profile.totalAttempts
  );

  const readinessScore = calculateReadinessScore(
    profile.averageAccuracy,
    profile.averageAccuracy,
    disciplineIndex,
    profile.completedAttempts
  );

  const strongestCategory =
    categories.length > 0 && categories[0].averageAccuracy > 50 ? categories[0].category : null;
  const weakestCategory =
    categories.length > 1 && categories[categories.length - 1].averageAccuracy < 50
      ? categories[categories.length - 1].category
      : null;

  const updatedProfile = await prisma.userPerformanceProfile.update({
    where: { userId: user.id },
    data: {
      participationGaps: updatedGaps,
      disciplineIndex,
      readinessScore,
      strongestCategory,
      weakestCategory,
      lastInsightGeneratedAt: new Date(),
    },
  });

  return {
    profile: updatedProfile,
    categories,
    difficulties,
  };
}

export async function generatePerformanceInsights(): Promise<IntelligenceInsight[]> {
  const user = await requireAuth();

  const profile = await prisma.userPerformanceProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) return [];

  const categories = await prisma.userCategoryPerformance.findMany({
    where: { userId: user.id },
  });

  const difficulties = await prisma.userDifficultyPerformance.findMany({
    where: { userId: user.id },
  });

  return generateDeterministicInsights(categories, difficulties, profile);
}

export async function calculateDifficultyAnalytics() {
  const user = await requireAuth();

  return await prisma.userDifficultyPerformance.findMany({
    where: { userId: user.id },
    orderBy: { difficulty: "asc" },
  });
}

export async function detectWeakAreas() {
  const user = await requireAuth();
  const profile = await prisma.userPerformanceProfile.findUnique({
    where: { userId: user.id },
  });
  return profile?.weakestCategory || null;
}

export async function detectStrongAreas() {
  const user = await requireAuth();
  const profile = await prisma.userPerformanceProfile.findUnique({
    where: { userId: user.id },
  });
  return profile?.strongestCategory || null;
}

export async function getCompetitiveReadiness() {
  const user = await requireAuth();
  const profile = await prisma.userPerformanceProfile.findUnique({
    where: { userId: user.id },
  });
  return profile?.readinessScore || 0;
}

export async function getPerformanceProfile() {
  const user = await requireAuth();

  let profile = await prisma.userPerformanceProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    profile = await prisma.userPerformanceProfile.create({
      data: { userId: user.id },
    });
  }

  return profile;
}
