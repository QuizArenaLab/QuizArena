// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { LifecycleState, ChallengeDifficulty } from "@/generated/prisma";

export interface RotationRecommendation {
  questionId: string;
  action: "PROMOTE" | "REDUCE_EXPOSURE";
  reason: string;
  currentAttempts: number;
}

/**
 * Identifies questions that are heavily overused and recommends reducing their exposure.
 * Identifies questions that are healthy but underused and recommends promoting them.
 *
 * This is a recommendation-only engine. It does not automatically modify challenge
 * selection algorithms.
 */
export async function generateContentRotationRecommendations(
  category?: string,
  difficulty?: ChallengeDifficulty,
  limit: number = 50
): Promise<RotationRecommendation[]> {
  const recommendations: RotationRecommendation[] = [];

  // Define criteria for overused
  const OVERUSED_THRESHOLD = 5000;

  // Find heavily overused questions
  const overusedQuestions = await prisma.question.findMany({
    where: {
      isActive: true,
      category: category ? category : undefined,
      difficulty: difficulty ? difficulty : undefined,
      usageStats: {
        timesAttempted: { gt: OVERUSED_THRESHOLD },
      },
    },
    include: { usageStats: true },
    take: limit / 2,
    orderBy: { usageStats: { timesAttempted: "desc" } },
  });

  for (const q of overusedQuestions) {
    recommendations.push({
      questionId: q.id,
      action: "REDUCE_EXPOSURE",
      reason: `Question has been attempted ${q.usageStats?.timesAttempted} times. Recommend reducing exposure to maintain freshness.`,
      currentAttempts: q.usageStats?.timesAttempted || 0,
    });
  }

  // Define criteria for underused but healthy
  const UNDERUSED_THRESHOLD = 50;

  const underusedQuestions = await prisma.question.findMany({
    where: {
      isActive: true,
      lifecycleState: { in: [LifecycleState.HEALTHY, LifecycleState.INSUFFICIENT_DATA] },
      category: category ? category : undefined,
      difficulty: difficulty ? difficulty : undefined,
      OR: [
        { usageStats: { is: null } },
        { usageStats: { timesAttempted: { lt: UNDERUSED_THRESHOLD } } },
      ],
    },
    include: { usageStats: true, analytics: true },
    take: limit / 2,
    orderBy: { createdAt: "desc" },
  });

  for (const q of underusedQuestions) {
    const attempts = q.usageStats?.timesAttempted || q.analytics?.totalAttempts || 0;
    recommendations.push({
      questionId: q.id,
      action: "PROMOTE",
      reason: `Question is healthy but has only been attempted ${attempts} times. Recommend promoting in rotations.`,
      currentAttempts: attempts,
    });
  }

  return recommendations;
}
