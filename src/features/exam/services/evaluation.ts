"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import type {
  EvaluationResult,
  QuestionResultDetail,
  CategoryRankingEntry,
  LeaderboardResponse,
} from "@/types/challenge";

// ─── Evaluation Result ───────────────────────────────────────────

/**
 * Get the complete evaluation result for an attempt.
 * Returns scoring, ranking, and question-by-question details.
 * This is the single query powering the results page.
 */
export async function getEvaluationResult(attemptId: string): Promise<EvaluationResult | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const attempt = await prisma.attempt.findFirst({
    where: {
      id: attemptId,
      userId: session.user.id,
      status: { in: ["SUBMITTED", "EVALUATED", "ABANDONED"] },
    },
    include: {
      challenge: {
        include: {
          snapshots: {
            orderBy: { orderIndex: "asc" },
          },
        },
      },
      answers: true,
    },
  });

  if (!attempt) return null;

  // Calculate scoring
  const totalQuestions = attempt.challenge.totalQuestions || attempt.challenge.snapshots.length;
  const correctAnswers = attempt.correctAnswers;
  const wrongAnswers = attempt.wrongAnswers;
  const unansweredCount = attempt.unansweredCount;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  // Get ranking data
  const leaderboardEntry = await prisma.leaderboardEntry.findUnique({
    where: {
      challengeId_userId: {
        challengeId: attempt.challengeId,
        userId: session.user.id,
      },
    },
    select: { rank: true },
  });

  const totalParticipants = await prisma.leaderboardEntry.count({
    where: { challengeId: attempt.challengeId },
  });

  const isRankFrozen = attempt.challenge.leaderboardFrozen;

  // Build question-by-question details
  const questions: QuestionResultDetail[] = attempt.challenge.snapshots.map((cq) => {
    const answer = attempt.answers.find(
      (a: { questionId: string }) => a.questionId === cq.originalQuestionId
    );
    const options = cq.options as Array<{
      id: string;
      optionText: string;
      isCorrect: boolean;
      order: number;
    }>;
    const correctOption = options.find((opt) => opt.id === cq.correctOption);

    return {
      questionId: cq.originalQuestionId,
      questionText: cq.question,
      selectedOptionId: answer?.selectedOptionId || null,
      selectedOptionText: answer?.selectedOption || null,
      correctOptionId: correctOption?.id || "",
      correctOptionText: correctOption?.optionText || "",
      isCorrect: answer?.isCorrect === true,
      isUnanswered: !answer || !answer.selectedOptionId,
      explanation: cq.explanation || null,
    };
  });

  return {
    attemptId: attempt.id,
    challengeId: attempt.challengeId,
    challengeTitle: attempt.challenge.title,
    challengeSlug: attempt.challenge.slug,
    challengeStatus: attempt.challenge.status,

    score: attempt.score,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    unansweredCount,
    accuracy: Math.round(accuracy * 100) / 100,

    timeTakenInSeconds: attempt.timeTakenInSeconds || 0,

    rank: leaderboardEntry?.rank || null,
    totalParticipants,
    isRankFrozen,

    questions,
  };
}

// ─── Leaderboard Queries ─────────────────────────────────────────

/**
 * Get leaderboard for a challenge — works for both LIVE and ENDED challenges.
 * For LIVE challenges: shows live rankings (isFrozen = false).
 * For ENDED challenges: shows frozen rankings (isFrozen = true).
 */
export async function getLeaderboard(
  challengeId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<LeaderboardResponse | null> {
  const session = await auth();

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: {
      id: true,
      title: true,
      status: true,
      totalQuestions: true,
      leaderboardFrozen: true,
    },
  });

  if (!challenge) return null;

  // Leaderboard visible for LIVE (live rankings) and ENDED/ARCHIVED (frozen)
  if (challenge.status === "DRAFT" || challenge.status === "SCHEDULED") {
    return null;
  }

  const skip = (page - 1) * pageSize;

  const [entries, totalCount] = await Promise.all([
    prisma.leaderboardEntry.findMany({
      where: { challengeId },
      orderBy: { rank: "asc" },
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    }),
    prisma.leaderboardEntry.count({ where: { challengeId } }),
  ]);

  // Get requesting user's rank if they participated
  let userRank: number | undefined;
  if (session?.user?.id) {
    const userEntry = await prisma.leaderboardEntry.findUnique({
      where: {
        challengeId_userId: {
          challengeId,
          userId: session.user.id,
        },
      },
      select: { rank: true },
    });
    userRank = userEntry?.rank;
  }

  return {
    entries: entries.map((entry) => ({
      rank: entry.rank,
      userId: entry.userId,
      username: entry.user.username,
      name: entry.user.name,
      image: entry.user.image,
      score: entry.score,
      accuracy: entry.accuracy,
      timeTakenInSeconds: entry.timeTakenInSeconds,
      frozenAt: entry.frozenAt,
    })),
    totalParticipants: totalCount,
    challengeId: challenge.id,
    challengeTitle: challenge.title,
    userRank,
    isFrozen: challenge.leaderboardFrozen,
  };
}

/**
 * Get category-based leaderboard — aggregated across all challenges in a category.
 * Uses database-level grouping for scalability.
 */
export async function getCategoryLeaderboard(
  category: string,
  limit: number = 50
): Promise<CategoryRankingEntry[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Get all leaderboard entries for this category
  const results = await prisma.leaderboardEntry.findMany({
    where: {
      category,
      challenge: {
        status: { in: ["ENDED", "ARCHIVED"] },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // Aggregate by user
  const userScores = new Map<
    string,
    {
      userId: string;
      username: string | null;
      name: string | null;
      image: string | null;
      totalScore: number;
      totalAccuracy: number;
      challengeCount: number;
    }
  >();

  for (const entry of results) {
    const existing = userScores.get(entry.userId);
    if (existing) {
      existing.totalScore += entry.score;
      existing.totalAccuracy += entry.accuracy;
      existing.challengeCount++;
    } else {
      userScores.set(entry.userId, {
        userId: entry.userId,
        username: entry.user.username,
        name: entry.user.name,
        image: entry.user.image,
        totalScore: entry.score,
        totalAccuracy: entry.accuracy,
        challengeCount: 1,
      });
    }
  }

  // Sort by total score descending, then by average accuracy
  const sorted: CategoryRankingEntry[] = Array.from(userScores.values())
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      const avgA = a.challengeCount > 0 ? a.totalAccuracy / a.challengeCount : 0;
      const avgB = b.challengeCount > 0 ? b.totalAccuracy / b.challengeCount : 0;
      return avgB - avgA;
    })
    .slice(0, limit)
    .map((user, index) => ({
      rank: index + 1,
      userId: user.userId,
      username: user.username,
      name: user.name,
      image: user.image,
      totalScore: user.totalScore,
      averageAccuracy:
        user.challengeCount > 0 ? Math.round(user.totalAccuracy / user.challengeCount) : 0,
      challengesCompleted: user.challengeCount,
    }));

  return sorted;
}

/**
 * Get the requesting user's rank in a specific challenge.
 */
export async function getUserRankInChallenge(
  challengeId: string
): Promise<{ rank: number; totalParticipants: number } | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const entry = await prisma.leaderboardEntry.findUnique({
    where: {
      challengeId_userId: {
        challengeId,
        userId: session.user.id,
      },
    },
    select: { rank: true },
  });

  if (!entry) return null;

  const totalParticipants = await prisma.leaderboardEntry.count({
    where: { challengeId },
  });

  return {
    rank: entry.rank,
    totalParticipants,
  };
}

/**
 * Get all of the requesting user's rankings across challenges.
 */
export async function getUserRankings(): Promise<
  {
    challengeId: string;
    challengeTitle: string;
    challengeSlug: string;
    category: string | null;
    rank: number;
    score: number;
    accuracy: number;
    timeTakenInSeconds: number;
    isFrozen: boolean;
    frozenAt: Date;
  }[]
> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const entries = await prisma.leaderboardEntry.findMany({
    where: { userId: session.user.id },
    include: {
      challenge: {
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          leaderboardFrozen: true,
        },
      },
    },
    orderBy: { frozenAt: "desc" },
  });

  return entries.map((entry) => ({
    challengeId: entry.challengeId,
    challengeTitle: entry.challenge.title,
    challengeSlug: entry.challenge.slug,
    category: entry.challenge.category || null,
    rank: entry.rank,
    score: entry.score,
    accuracy: entry.accuracy,
    timeTakenInSeconds: entry.timeTakenInSeconds,
    isFrozen: entry.challenge.leaderboardFrozen,
    frozenAt: entry.frozenAt,
  }));
}
