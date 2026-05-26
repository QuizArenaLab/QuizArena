"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { hasMinimumRole } from "@/auth/roles/role-hierarchy";
import { ROLE } from "@/auth/roles/role-types";
import {
  challengeAnalyticsFilterSchema,
  questionAnalyticsFilterSchema,
  analyticsTimeRangeSchema,
} from "@/lib/validations/analytics";

async function validateAnalyticsAccess() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Please sign in");
  }

  const userRole = (session.user.role as string) || "USER";

  if (!hasMinimumRole(userRole, ROLE.MODERATOR)) {
    throw new Error("Access denied: Analytics requires MODERATOR role or higher");
  }

  return session;
}

function getDateFilter(timeRange: string): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const startDate = new Date();

  switch (timeRange) {
    case "daily":
      startDate.setDate(startDate.getDate() - 1);
      break;
    case "weekly":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "monthly":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    default:
      startDate.setFullYear(startDate.getFullYear() - 10);
  }

  return { startDate, endDate };
}

export async function getDashboardOverview() {
  await validateAnalyticsAccess();

  const { startDate, endDate } = getDateFilter("monthly");

  const [
    totalChallenges,
    publishedChallenges,
    totalAttempts,
    completedAttempts,
    uniqueParticipants,
    averageScore,
    averageCompletionTime,
  ] = await Promise.all([
    prisma.challenge.count(),
    prisma.challenge.count({ where: { status: "LIVE" } }),
    prisma.attempt.count({
      where: { startedAt: { gte: startDate, lte: endDate } },
    }),
    prisma.attempt.count({
      where: { submittedAt: { not: null, gte: startDate, lte: endDate } },
    }),
    prisma.attempt
      .groupBy({
        by: ["userId"],
        where: { startedAt: { gte: startDate, lte: endDate } },
      })
      .then((result) => result.length),
    prisma.attempt.aggregate({
      where: { submittedAt: { not: null, gte: startDate, lte: endDate } },
      _avg: { score: true },
    }),
    prisma.attempt.aggregate({
      where: { submittedAt: { not: null, gte: startDate, lte: endDate } },
      _avg: { timeTakenInSeconds: true },
    }),
  ]);

  const completionRate = totalAttempts > 0 ? (completedAttempts / totalAttempts) * 100 : 0;

  return {
    totalChallenges,
    publishedChallenges,
    totalAttempts,
    completedAttempts,
    uniqueParticipants,
    averageScore: averageScore._avg.score || 0,
    averageCompletionTime: averageCompletionTime._avg.timeTakenInSeconds || 0,
    completionRate,
  };
}

export async function getChallengePerformanceMetrics(
  filter: Partial<{
    challengeId: string;
    timeRange: string;
    category: string | null;
    difficulty: string | null;
  }> = {}
) {
  await validateAnalyticsAccess();

  const parsedFilter = challengeAnalyticsFilterSchema.parse(filter);
  const { startDate, endDate } = getDateFilter(parsedFilter.timeRange);

  const whereClause: Record<string, unknown> = {
    startedAt: { gte: startDate, lte: endDate },
  };

  if (parsedFilter.challengeId) {
    whereClause.challengeId = parsedFilter.challengeId;
  }

  if (parsedFilter.category) {
    whereClause.challenge = {
      category: parsedFilter.category as "SSC" | "BANKING" | "RAILWAYS" | "STATE_PSC",
    };
  }

  if (parsedFilter.difficulty) {
    const existing = (whereClause.challenge as Record<string, unknown>) || {};
    whereClause.challenge = {
      ...existing,
      difficulty: parsedFilter.difficulty as "BEGINNER" | "MEDIUM" | "HARDCORE",
    };
  }

  const [aggregated, byChallenge] = await Promise.all([
    prisma.attempt.aggregate({
      where: whereClause,
      _count: { id: true },
      _avg: { score: true, timeTakenInSeconds: true },
      _max: { score: true },
      _min: { score: true },
    }),
    prisma.attempt.groupBy({
      by: ["challengeId"],
      where: whereClause,
      _count: { id: true },
      _avg: { score: true, timeTakenInSeconds: true },
      _max: { score: true },
      _min: { score: true },
    }),
  ]);

  const challenges = await prisma.challenge.findMany({
    where: { id: { in: byChallenge.map((b) => b.challengeId) } },
    select: { id: true, title: true, slug: true, category: true, difficulty: true },
  });

  const challengeMap = new Map(challenges.map((c) => [c.id, c]));

  const topPerforming = byChallenge
    .filter((b) => b._avg.score !== null)
    .sort((a, b) => (b._avg.score || 0) - (a._avg.score || 0))
    .slice(0, 5)
    .map((b) => ({
      challenge: challengeMap.get(b.challengeId) || null,
      metrics: {
        totalAttempts: b._count.id,
        averageScore: b._avg.score || 0,
        highestScore: b._max.score || 0,
        averageTime: b._avg.timeTakenInSeconds || 0,
      },
    }));

  const lowCompletion = await prisma.attempt.groupBy({
    by: ["challengeId"],
    where: {
      ...whereClause,
      submittedAt: null,
    },
    _count: { id: true },
  });

  const lowCompletionMap = new Map(lowCompletion.map((l) => [l.challengeId, l._count.id]));

  const needsAttention = byChallenge
    .map((b) => ({
      challenge: challengeMap.get(b.challengeId) || null,
      totalAttempts: b._count.id,
      incompleteAttempts: lowCompletionMap.get(b.challengeId) || 0,
    }))
    .filter((c) => c.totalAttempts > 0)
    .sort((a, b) => {
      const aRate = a.incompleteAttempts / a.totalAttempts;
      const bRate = b.incompleteAttempts / b.totalAttempts;
      return bRate - aRate;
    })
    .slice(0, 5);

  return {
    overall: {
      totalAttempts: aggregated._count.id,
      averageScore: aggregated._avg.score || 0,
      highestScore: aggregated._max.score || 0,
      lowestScore: aggregated._min.score || 0,
      averageTime: aggregated._avg.timeTakenInSeconds || 0,
    },
    topPerforming,
    needsAttention,
  };
}

export async function getQuestionAnalytics(
  filter: Partial<{
    questionId: string;
    timeRange: string;
    difficulty: string | null;
    subject: string | null;
    topic: string | null;
  }> = {}
) {
  await validateAnalyticsAccess();

  const parsedFilter = questionAnalyticsFilterSchema.parse(filter);
  const { startDate, endDate } = getDateFilter(parsedFilter.timeRange);

  const questions = await prisma.question.findMany({
    where: {
      status: "APPROVED",
      ...(parsedFilter.difficulty && {
        difficulty: parsedFilter.difficulty as "BEGINNER" | "MEDIUM" | "HARDCORE",
      }),
      ...(parsedFilter.subject && { subject: parsedFilter.subject }),
      ...(parsedFilter.topic && { topic: parsedFilter.topic }),
    },
    select: {
      id: true,
      question: true,
      subject: true,
      topic: true,
      difficulty: true,
      marks: true,
    },
  });

  const questionIds = questions.map((q) => q.id);

  const answerStats = await prisma.attemptAnswer.groupBy({
    by: ["questionId", "isCorrect", "isSkipped"],
    where: {
      questionId: { in: questionIds },
      attempt: {
        startedAt: { gte: startDate, lte: endDate },
      },
    },
    _count: { id: true },
  });

  const statsMap = new Map<
    string,
    { correct: number; wrong: number; skipped: number; total: number }
  >();

  for (const stat of answerStats) {
    if (!stat.questionId) continue;
    const existing = statsMap.get(stat.questionId) || {
      correct: 0,
      wrong: 0,
      skipped: 0,
      total: 0,
    };
    existing.total += stat._count.id;
    if (stat.isSkipped) {
      existing.skipped += stat._count.id;
    } else if (stat.isCorrect === true) {
      existing.correct += stat._count.id;
    } else if (stat.isCorrect === false) {
      existing.wrong += stat._count.id;
    }
    statsMap.set(stat.questionId, existing);
  }

  const questionAnalytics = questions.map((q) => {
    const stats = statsMap.get(q.id) || { correct: 0, wrong: 0, skipped: 0, total: 0 };
    const accuracyRate = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    const skipRate = stats.total > 0 ? (stats.skipped / stats.total) * 100 : 0;

    return {
      question: {
        id: q.id,
        question: q.question.substring(0, 100) + (q.question.length > 100 ? "..." : ""),
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty,
        marks: q.marks,
      },
      analytics: {
        totalAttempts: stats.total,
        correctAttempts: stats.correct,
        wrongAttempts: stats.wrong,
        skippedAttempts: stats.skipped,
        accuracyRate: Math.round(accuracyRate * 10) / 10,
        skipRate: Math.round(skipRate * 10) / 10,
      },
    };
  });

  const sortedByAccuracy = [...questionAnalytics].sort(
    (a, b) => a.analytics.accuracyRate - b.analytics.accuracyRate
  );

  const difficultQuestions = sortedByAccuracy.slice(0, 10);
  const easyQuestions = sortedByAccuracy.slice(-10).reverse();
  const highSkipRate = questionAnalytics
    .filter((q) => q.analytics.skipRate > 20)
    .sort((a, b) => b.analytics.skipRate - a.analytics.skipRate)
    .slice(0, 10);

  return {
    questions: questionAnalytics,
    difficultQuestions,
    easyQuestions,
    highSkipRate,
  };
}

export async function getEngagementTrends(timeRange: string = "monthly") {
  await validateAnalyticsAccess();

  const parsedRange = analyticsTimeRangeSchema.parse(timeRange);
  const { startDate, endDate } = getDateFilter(parsedRange);

  const dailyAttempts = await prisma.attempt.groupBy({
    by: ["startedAt"],
    where: {
      startedAt: { gte: startDate, lte: endDate },
    },
    _count: { id: true },
    _avg: { score: true },
  });

  const dateMap = new Map<string, { count: number; avgScore: number }>();

  for (const attempt of dailyAttempts) {
    const dateKey = attempt.startedAt.toISOString().split("T")[0];
    const existing = dateMap.get(dateKey) || { count: 0, avgScore: 0 };
    existing.count += attempt._count.id;
    existing.avgScore = (existing.avgScore + (attempt._avg.score || 0)) / 2;
    dateMap.set(dateKey, existing);
  }

  const trends = Array.from(dateMap.entries())
    .map(([date, data]) => ({
      date,
      attempts: data.count,
      averageScore: Math.round(data.avgScore * 10) / 10,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return trends;
}

export async function getDifficultyInsights() {
  await validateAnalyticsAccess();

  const { startDate, endDate } = getDateFilter("monthly");

  const byDifficulty = await prisma.attempt.groupBy({
    by: ["challengeId"],
    where: {
      submittedAt: { not: null },
      startedAt: { gte: startDate, lte: endDate },
    },
    _avg: { score: true },
    _count: { id: true },
  });

  const challengeDifficulties = await prisma.challenge.findMany({
    where: { id: { in: byDifficulty.map((b) => b.challengeId) } },
    select: { id: true, difficulty: true, title: true },
  });

  const difficultyMap = new Map(challengeDifficulties.map((c) => [c.id, c.difficulty]));

  const difficultyStats: Record<string, { total: number; avgScore: number; count: number }> = {
    EASY: { total: 0, avgScore: 0, count: 0 },
    MEDIUM: { total: 0, avgScore: 0, count: 0 },
    HARD: { total: 0, avgScore: 0, count: 0 },
  };

  for (const stat of byDifficulty) {
    const difficulty = difficultyMap.get(stat.challengeId);
    if (difficulty && difficultyStats[difficulty]) {
      difficultyStats[difficulty].total += stat._avg.score || 0;
      difficultyStats[difficulty].count += stat._count.id;
    }
  }

  const insights = Object.entries(difficultyStats).map(([difficulty, stats]) => ({
    difficulty,
    totalAttempts: stats.count,
    averageScore: stats.count > 0 ? Math.round((stats.total / stats.count) * 10) / 10 : 0,
  }));

  return insights;
}

export async function getCategoryAnalytics() {
  await validateAnalyticsAccess();

  const { startDate, endDate } = getDateFilter("monthly");

  const byCategory = await prisma.attempt.groupBy({
    by: ["challengeId"],
    where: {
      startedAt: { gte: startDate, lte: endDate },
    },
    _count: { id: true },
    _avg: { score: true },
  });

  const challengeCategories = await prisma.challenge.findMany({
    where: { id: { in: byCategory.map((b) => b.challengeId) } },
    select: { id: true, category: true, title: true },
  });

  const categoryMap = new Map(challengeCategories.map((c) => [c.id, c.category]));

  const categoryStats: Record<string, { total: number; avgScore: number; count: number }> = {
    SSC: { total: 0, avgScore: 0, count: 0 },
    BANKING: { total: 0, avgScore: 0, count: 0 },
    RAILWAYS: { total: 0, avgScore: 0, count: 0 },
    STATE_PSC: { total: 0, avgScore: 0, count: 0 },
  };

  for (const stat of byCategory) {
    const category = categoryMap.get(stat.challengeId);
    if (category && categoryStats[category]) {
      categoryStats[category].total += stat._avg.score || 0;
      categoryStats[category].count += stat._count.id;
    }
  }

  const analytics = Object.entries(categoryStats)
    .map(([category, stats]) => ({
      category,
      totalAttempts: stats.count,
      averageScore: stats.count > 0 ? Math.round((stats.total / stats.count) * 10) / 10 : 0,
    }))
    .filter((c) => c.totalAttempts > 0);

  return analytics;
}

export async function generateInsights(): Promise<
  Array<{ type: string; message: string; severity: "info" | "warning" | "critical" }>
> {
  await validateAnalyticsAccess();

  const insights: Array<{
    type: string;
    message: string;
    severity: "info" | "warning" | "critical";
  }> = [];

  const { startDate, endDate } = getDateFilter("monthly");

  const [completionStats, difficultyStats, questionStats] = await Promise.all([
    prisma.attempt.groupBy({
      by: ["challengeId"],
      where: {
        startedAt: { gte: startDate, lte: endDate },
      },
      _count: { id: true },
    }),
    prisma.challenge.groupBy({
      by: ["difficulty"],
      where: { status: "LIVE" },
      _count: { id: true },
    }),
    prisma.attemptAnswer.groupBy({
      by: ["questionId", "isCorrect"],
      where: {
        attempt: {
          startedAt: { gte: startDate, lte: endDate },
        },
      },
      _count: { id: true },
    }),
  ]);

  const totalAttempts = completionStats.reduce((sum, s) => sum + s._count.id, 0);
  const avgAttemptsPerChallenge =
    completionStats.length > 0 ? totalAttempts / completionStats.length : 0;

  if (avgAttemptsPerChallenge < 5) {
    insights.push({
      type: "engagement",
      message: `Low participation: Average ${avgAttemptsPerChallenge.toFixed(1)} attempts per challenge. Consider promotional activities.`,
      severity: "warning",
    });
  }

  const easyCount = difficultyStats.find((d) => d.difficulty === "BEGINNER")?._count.id || 0;
  const hardCount = difficultyStats.find((d) => d.difficulty === "HARDCORE")?._count.id || 0;

  if (easyCount > hardCount * 3) {
    insights.push({
      type: "difficulty",
      message:
        "Challenge distribution skewed: Significantly more easy challenges. Consider adding harder content.",
      severity: "info",
    });
  }

  const correctCount = questionStats
    .filter((s) => s.isCorrect === true)
    .reduce((sum, s) => sum + s._count.id, 0);
  const wrongCount = questionStats
    .filter((s) => s.isCorrect === false)
    .reduce((sum, s) => sum + s._count.id, 0);
  const totalAnswers = correctCount + wrongCount;

  if (totalAnswers > 0) {
    const accuracyRate = (correctCount / totalAnswers) * 100;

    if (accuracyRate < 30) {
      insights.push({
        type: "difficulty",
        message: `Overall accuracy is low (${accuracyRate.toFixed(1)}%). Questions may be too difficult.`,
        severity: "critical",
      });
    } else if (accuracyRate > 80) {
      insights.push({
        type: "difficulty",
        message: `Overall accuracy is high (${accuracyRate.toFixed(1)}%). Questions may be too easy.`,
        severity: "info",
      });
    }
  }

  return insights;
}

export async function getLeaderboardData(limit: number = 10) {
  const { user } = await validateAnalyticsAccess();
  const userRole = (user.role as string) || "USER";

  if (!hasMinimumRole(userRole, ROLE.ADMIN)) {
    throw new Error("Access denied: Leaderboard requires ADMIN role or higher");
  }

  const { startDate, endDate } = getDateFilter("monthly");

  const leaderboard = await prisma.attempt.groupBy({
    by: ["userId"],
    where: {
      submittedAt: { not: null },
      startedAt: { gte: startDate, lte: endDate },
    },
    _sum: { score: true },
    _count: { id: true },
    orderBy: { _sum: { score: "desc" } },
    take: limit,
  });

  const userIds = leaderboard.map((l) => l.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, username: true, image: true },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));

  return leaderboard.map((entry, index) => ({
    rank: index + 1,
    user: userMap.get(entry.userId),
    totalScore: entry._sum.score || 0,
    totalAttempts: entry._count.id,
  }));
}
