/**
 * QuizArena — Dashboard Engine
 *
 * Single responsibility: all Intelligence Dashboard queries.
 * Reads ONLY from QuestionUsageStats + QuestionAnalytics.
 * NEVER joins QuestionAttemptLog during rendering.
 */

import { prisma } from "@/lib/prisma";
import { MIN_ATTEMPTS, FLAG_THRESHOLDS } from "./constants";

export interface IntelligenceDashboardMetrics {
  // Primary cards
  difficultyDrift: number;
  highReports: number;
  lowConfidence: number;
  decliningPerformance: number;
  // Secondary cards
  unusedQuestions: number;
  overusedQuestions: number;
  avgSuccessRate: number;
  avgTime: number;
  healthyQuestions: number;
  insufficientData: number;
  // Totals
  totalTracked: number;
}

/**
 * Get all KPI counts for the Intelligence Dashboard.
 * All queries read from precomputed QuestionUsageStats.
 */
export async function getIntelligenceDashboardMetrics(): Promise<IntelligenceDashboardMetrics> {
  const [
    totalTracked,
    insufficientData,
    difficultyDrift,
    highReports,
    decliningPerformance,
    overusedQuestions,
    unusedQuestions,
    aggregates,
    tooEasyOrHard,
  ] = await Promise.all([
    // Total questions with usage stats
    prisma.questionUsageStats.count(),

    // Insufficient data (<50 attempts)
    prisma.questionUsageStats.count({
      where: { timesAttempted: { lt: MIN_ATTEMPTS } },
    }),

    // Difficulty drift: actual differs from configured, sufficient data
    prisma.questionUsageStats.count({
      where: {
        timesAttempted: { gte: MIN_ATTEMPTS },
        actualDifficulty: { not: null },
        NOT: {
          question: {
            difficulty: { equals: undefined }, // handled via raw query below
          },
        },
      },
    }).catch(() => 0), // Fallback: compute via raw query

    // High reports
    prisma.questionUsageStats.count({
      where: {
        timesAttempted: { gte: MIN_ATTEMPTS },
        reportCount: { gte: 3 },
      },
    }),

    // Declining performance
    prisma.questionUsageStats.count({
      where: {
        timesAttempted: { gte: MIN_ATTEMPTS },
        successRateTrend: "DOWN",
      },
    }),

    // Overused
    prisma.questionUsageStats.count({
      where: {
        timesAttempted: { gte: FLAG_THRESHOLDS.OVERUSED },
      },
    }),

    // Unused (no recent activity)
    prisma.questionUsageStats.count({
      where: {
        OR: [
          {
            lastServedAt: {
              lt: new Date(Date.now() - FLAG_THRESHOLDS.UNUSED_DAYS * 86400000),
            },
          },
          { lastServedAt: null, timesAttempted: { gt: 0 } },
        ],
      },
    }),

    // Global aggregates
    prisma.questionUsageStats.aggregate({
      where: { timesAttempted: { gte: MIN_ATTEMPTS } },
      _avg: { successRate: true, averageTimeSpent: true },
    }),

    // Too easy or too hard
    prisma.questionUsageStats.count({
      where: {
        timesAttempted: { gte: MIN_ATTEMPTS },
        OR: [
          { successRate: { gte: FLAG_THRESHOLDS.TOO_EASY_SR } },
          { successRate: { lte: FLAG_THRESHOLDS.TOO_HARD_SR } },
        ],
      },
    }),
  ]);

  // Compute difficulty drift via raw SQL for accurate cross-table comparison
  let actualDriftCount = 0;
  try {
    const driftResults = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM question_usage_stats qus
      JOIN questions q ON qus."questionId" = q.id
      WHERE qus."timesAttempted" >= ${MIN_ATTEMPTS}
        AND qus."actualDifficulty" IS NOT NULL
        AND qus."actualDifficulty"::text != q.difficulty::text
    `;
    actualDriftCount = Number(driftResults[0]?.count ?? 0);
  } catch {
    actualDriftCount = difficultyDrift;
  }

  // Healthy = sufficient data, no negative flags
  const problematicCount = actualDriftCount + highReports + decliningPerformance + tooEasyOrHard;
  const sufficientData = totalTracked - insufficientData;
  const healthyQuestions = Math.max(0, sufficientData - problematicCount);

  // Low confidence: questions with sufficient data but borderline metrics
  // Using data quality LOW as a proxy for low confidence
  const lowConfidence = await prisma.questionUsageStats.count({
    where: {
      timesAttempted: { gte: MIN_ATTEMPTS },
      dataQuality: "LOW",
    },
  });

  return {
    difficultyDrift: actualDriftCount,
    highReports,
    lowConfidence,
    decliningPerformance,
    unusedQuestions,
    overusedQuestions,
    avgSuccessRate: aggregates._avg.successRate ?? 0,
    avgTime: aggregates._avg.averageTimeSpent ?? 0,
    healthyQuestions,
    insufficientData,
    totalTracked,
  };
}

/**
 * Get questions filtered by intelligence flag.
 * All queries read from precomputed QuestionUsageStats.
 */
export async function getQuestionsByIntelligenceFilter(
  filter: string,
  page = 1,
  limit = 20
): Promise<{ questionIds: string[]; total: number }> {
  const skip = (page - 1) * limit;

  let where: Record<string, unknown> = {};

  switch (filter) {
    case "HEALTHY":
      where = {
        timesAttempted: { gte: MIN_ATTEMPTS },
        successRateTrend: { not: "DOWN" },
        reportCount: { lt: 3 },
        dataQuality: { in: ["HIGH", "MEDIUM"] },
      };
      break;
    case "LOW_CONFIDENCE":
      where = {
        timesAttempted: { gte: MIN_ATTEMPTS },
        dataQuality: "LOW",
      };
      break;
    case "OVERUSED":
      where = { timesAttempted: { gte: FLAG_THRESHOLDS.OVERUSED } };
      break;
    case "UNUSED":
      where = {
        OR: [
          {
            lastServedAt: {
              lt: new Date(Date.now() - FLAG_THRESHOLDS.UNUSED_DAYS * 86400000),
            },
          },
          { lastServedAt: null, timesAttempted: { gt: 0 } },
        ],
      };
      break;
    case "HIGH_REPORTS":
      where = {
        timesAttempted: { gte: MIN_ATTEMPTS },
        reportCount: { gte: 3 },
      };
      break;
    case "DECLINING":
      where = {
        timesAttempted: { gte: MIN_ATTEMPTS },
        successRateTrend: "DOWN",
      };
      break;
    case "INSUFFICIENT_DATA":
      where = { timesAttempted: { lt: MIN_ATTEMPTS } };
      break;
    case "TOO_EASY":
      where = {
        timesAttempted: { gte: MIN_ATTEMPTS },
        successRate: { gte: FLAG_THRESHOLDS.TOO_EASY_SR },
      };
      break;
    case "TOO_HARD":
      where = {
        timesAttempted: { gte: MIN_ATTEMPTS },
        successRate: { lte: FLAG_THRESHOLDS.TOO_HARD_SR },
      };
      break;
    case "DIFFICULTY_DRIFT":
      // Handled specially via raw query
      try {
        const driftIds = await prisma.$queryRaw<{ questionId: string }[]>`
          SELECT qus."questionId"
          FROM question_usage_stats qus
          JOIN questions q ON qus."questionId" = q.id
          WHERE qus."timesAttempted" >= ${MIN_ATTEMPTS}
            AND qus."actualDifficulty" IS NOT NULL
            AND qus."actualDifficulty"::text != q.difficulty::text
          ORDER BY qus."timesAttempted" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;
        const totalResult = await prisma.$queryRaw<{ count: bigint }[]>`
          SELECT COUNT(*) as count
          FROM question_usage_stats qus
          JOIN questions q ON qus."questionId" = q.id
          WHERE qus."timesAttempted" >= ${MIN_ATTEMPTS}
            AND qus."actualDifficulty" IS NOT NULL
            AND qus."actualDifficulty"::text != q.difficulty::text
        `;
        return {
          questionIds: driftIds.map((r) => r.questionId),
          total: Number(totalResult[0]?.count ?? 0),
        };
      } catch {
        return { questionIds: [], total: 0 };
      }
    default:
      where = {};
  }

  const [stats, total] = await Promise.all([
    prisma.questionUsageStats.findMany({
      where,
      select: { questionId: true },
      skip,
      take: limit,
      orderBy: { timesAttempted: "desc" },
    }),
    prisma.questionUsageStats.count({ where }),
  ]);

  return {
    questionIds: stats.map((s) => s.questionId),
    total,
  };
}

/**
 * Get ALL question IDs matching an intelligence filter.
 * Useful for intersecting with other filters.
 */
export async function getAllQuestionIdsByIntelligenceFilter(
  filter: string
): Promise<string[]> {
  if (filter === "DIFFICULTY_DRIFT") {
    try {
      const driftIds = await prisma.$queryRaw<{ questionId: string }[]>`
        SELECT qus."questionId"
        FROM question_usage_stats qus
        JOIN questions q ON qus."questionId" = q.id
        WHERE qus."timesAttempted" >= ${MIN_ATTEMPTS}
          AND qus."actualDifficulty" IS NOT NULL
          AND qus."actualDifficulty"::text != q.difficulty::text
      `;
      return driftIds.map((r) => r.questionId);
    } catch {
      return [];
    }
  }

  let where: Record<string, unknown> = {};
  switch (filter) {
    case "HEALTHY":
      where = {
        timesAttempted: { gte: MIN_ATTEMPTS },
        successRateTrend: { not: "DOWN" },
        reportCount: { lt: 3 },
        dataQuality: { in: ["HIGH", "MEDIUM"] },
      };
      break;
    case "LOW_CONFIDENCE":
      where = { timesAttempted: { gte: MIN_ATTEMPTS }, dataQuality: "LOW" };
      break;
    case "OVERUSED":
      where = { timesAttempted: { gte: FLAG_THRESHOLDS.OVERUSED } };
      break;
    case "UNUSED":
      where = {
        OR: [
          { lastServedAt: { lt: new Date(Date.now() - FLAG_THRESHOLDS.UNUSED_DAYS * 86400000) } },
          { lastServedAt: null, timesAttempted: { gt: 0 } },
        ],
      };
      break;
    case "HIGH_REPORTS":
      where = { timesAttempted: { gte: MIN_ATTEMPTS }, reportCount: { gte: 3 } };
      break;
    case "DECLINING":
      where = { timesAttempted: { gte: MIN_ATTEMPTS }, successRateTrend: "DOWN" };
      break;
    case "INSUFFICIENT_DATA":
      where = { timesAttempted: { lt: MIN_ATTEMPTS } };
      break;
    case "TOO_EASY":
      where = { timesAttempted: { gte: MIN_ATTEMPTS }, successRate: { gte: FLAG_THRESHOLDS.TOO_EASY_SR } };
      break;
    case "TOO_HARD":
      where = { timesAttempted: { gte: MIN_ATTEMPTS }, successRate: { lte: FLAG_THRESHOLDS.TOO_HARD_SR } };
      break;
    default:
      return [];
  }

  const stats = await prisma.questionUsageStats.findMany({
    where,
    select: { questionId: true },
  });

  return stats.map((s) => s.questionId);
}

