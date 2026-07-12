// @ts-nocheck
/**
 * QuizArena — Usage Intelligence Orchestrator
 *
 * Thin orchestration layer that delegates to dedicated analytics services.
 * Preserved for backward compatibility — existing imports continue to work.
 *
 * All computation logic has been moved to:
 *   analytics/attempt-tracker.ts
 *   analytics/usage-aggregator.ts
 *   analytics/difficulty-engine.ts
 *   analytics/benchmark-engine.ts
 *   analytics/recommendation-engine.ts
 *   analytics/trend-engine.ts
 *   analytics/dashboard-engine.ts
 */

import { prisma } from "@/lib/prisma";
import { logQuestionAttempts as _logAttempts } from "./analytics/attempt-tracker";
import {
  processPendingStats as _processPending,
  purgeOldAttemptLogs as _purge,
} from "./analytics/usage-aggregator";
import { generateDynamicFlags, generateRecommendations } from "./analytics/recommendation-engine";
import {
  computeConfidenceScore,
  computeTrends,
  getConfidenceLabel,
} from "./analytics/trend-engine";
import { classifyActualDifficulty, detectDifficultyDrift } from "./analytics/difficulty-engine";
import { getQuestionBenchmark } from "./analytics/benchmark-engine";
import {
  MIN_ATTEMPTS,
  type DynamicQuestionFlag,
  type ActualDifficultyLevel,
} from "./analytics/constants";
import type { Recommendation } from "./analytics/recommendation-engine";
import type { QuestionBenchmarks } from "./analytics/benchmark-engine";
import type { TrendSummary } from "./analytics/trend-engine";
import type { DifficultyDrift } from "./analytics/difficulty-engine";

// ─── Re-exports for backward compatibility ──────────────────────────────────

export { logQuestionAttempts } from "./analytics/attempt-tracker";
export { processPendingStats, purgeOldAttemptLogs } from "./analytics/usage-aggregator";
export type { DynamicQuestionFlag } from "./analytics/constants";

// ─── Full Question Intelligence Profile ─────────────────────────────────────

export interface QuestionIntelligence {
  usageStats: {
    timesAttempted: number;
    correctAttempts: number;
    incorrectAttempts: number;
    skippedAttempts: number;
    successRate: number;
    timesServed: number;
    lastServedAt: Date | null;
    lastAttemptedAt: Date | null;
    averageTimeSpent: number;
    medianTimeSpent: number;
    fastestTime: number | null;
    slowestTime: number | null;
    p90Time: number | null;
    reportCount: number;
    actualDifficulty: string | null;
    successRateTrend: string;
    attemptsTrend: string;
    reportsTrend: string;
    dataQuality: string;
    analyticsVersion: number;
  };
  dynamicFlags: DynamicQuestionFlag[];
  recommendations: Recommendation[];
  benchmarks: QuestionBenchmarks;
  trends: TrendSummary;
  difficulty: {
    configured: string;
    actual: ActualDifficultyLevel | null;
    drift: DifficultyDrift;
  };
  confidence: {
    score: number;
    label: string;
  };
  insufficientData: boolean;
}

/**
 * Get comprehensive intelligence profile for a question.
 * Delegates to all dedicated engines.
 */
export async function getQuestionIntelligence(questionId: string): Promise<QuestionIntelligence> {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      usageStats: true,
      reports: true,
    },
  });

  if (!question) throw new Error("Question not found");

  const rawStats = question.usageStats;
  const stats = {
    timesAttempted: rawStats?.timesAttempted ?? 0,
    correctAttempts: rawStats?.correctAttempts ?? 0,
    incorrectAttempts: rawStats?.incorrectAttempts ?? 0,
    skippedAttempts: rawStats?.skippedAttempts ?? 0,
    successRate: rawStats?.successRate ?? 0,
    timesServed: rawStats?.timesServed ?? 0,
    lastServedAt: rawStats?.lastServedAt ?? null,
    lastAttemptedAt: rawStats?.lastAttemptedAt ?? null,
    averageTimeSpent: rawStats?.averageTimeSpent ?? 0,
    medianTimeSpent: rawStats?.medianTimeSpent ?? 0,
    fastestTime: rawStats?.fastestTime ?? null,
    slowestTime: rawStats?.slowestTime ?? null,
    p90Time: rawStats?.p90Time ?? null,
    reportCount: rawStats?.reportCount ?? question.reports.length,
    actualDifficulty: rawStats?.actualDifficulty ?? null,
    successRateTrend: rawStats?.successRateTrend ?? "STABLE",
    attemptsTrend: rawStats?.attemptsTrend ?? "STABLE",
    reportsTrend: rawStats?.reportsTrend ?? "STABLE",
    dataQuality: rawStats?.dataQuality ?? "INSUFFICIENT",
    analyticsVersion: rawStats?.analyticsVersion ?? 1,
  };

  const insufficientData = stats.timesAttempted < MIN_ATTEMPTS;

  // Dynamic flags
  const dynamicFlags = generateDynamicFlags(
    stats,
    question.difficulty,
    question.createdAt,
    question.status
  );

  // Recommendations (gated by MIN_ATTEMPTS internally)
  const recommendations = insufficientData ? [] : await generateRecommendations(questionId);

  // Benchmarks (gated by MIN_ATTEMPTS internally)
  const benchmarks = insufficientData
    ? { byTopic: null, bySubject: null, byExam: null, insufficientData: true }
    : await getQuestionBenchmark(questionId);

  // Trends
  const trends = computeTrends(stats);

  // Difficulty analysis
  const actualDifficulty = insufficientData ? null : classifyActualDifficulty(stats.successRate);
  const drift = detectDifficultyDrift(question.difficulty, stats.successRate, stats.timesAttempted);

  // Confidence (computed dynamically, never stored)
  const confidenceScore = computeConfidenceScore(stats);
  const confidenceLabel = getConfidenceLabel(confidenceScore);

  return {
    usageStats: stats,
    dynamicFlags,
    recommendations,
    benchmarks,
    trends,
    difficulty: {
      configured: question.difficulty,
      actual: actualDifficulty,
      drift,
    },
    confidence: {
      score: confidenceScore,
      label: confidenceLabel,
    },
    insufficientData,
  };
}

/**
 * Dismiss a recommendation for a question.
 */
export async function dismissRecommendation(
  questionId: string,
  recommendationType: string,
  userId: string
) {
  await prisma.questionRecommendationDismissal.upsert({
    where: { questionId_recommendationType: { questionId, recommendationType } },
    update: {},
    create: { questionId, recommendationType, dismissedById: userId },
  });
}
