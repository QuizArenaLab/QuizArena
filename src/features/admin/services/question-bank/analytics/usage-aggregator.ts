/**
 * QuizArena — Usage Aggregator
 *
 * Single responsibility: computing aggregate statistics from
 * raw attempt logs into QuestionUsageStats.
 *
 * Runs as a background job — never during page rendering.
 */

import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";
import { DataQuality, type ChallengeDifficulty } from "@/generated/prisma";
import {
  MIN_ATTEMPTS,
  CURRENT_ANALYTICS_VERSION,
  DATA_QUALITY_THRESHOLDS,
  DIFFICULTY_THRESHOLDS,
  type TrendDirection,
} from "./constants";

/**
 * Classify data quality based on attempt count.
 */
function classifyDataQuality(attempts: number): DataQuality {
  if (attempts >= DATA_QUALITY_THRESHOLDS.HIGH) return DataQuality.HIGH;
  if (attempts >= DATA_QUALITY_THRESHOLDS.MEDIUM) return DataQuality.MEDIUM;
  if (attempts >= DATA_QUALITY_THRESHOLDS.LOW) return DataQuality.LOW;
  return DataQuality.INSUFFICIENT;
}

/**
 * Compute median from a sorted array of numbers.
 */
function computeMedian(sorted: number[]): number {
  if (sorted.length === 0) return 0;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Compute a percentile value from a sorted array.
 */
function computePercentile(sorted: number[], percentile: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

/**
 * Classify actual difficulty from success rate using 5-level system.
 */
function classifyDifficultyFromRate(successRate: number): ChallengeDifficulty | null {
  // Map 5-level to 3-level ChallengeDifficulty for storage
  if (successRate >= DIFFICULTY_THRESHOLDS.EASY) return "BEGINNER";
  if (successRate >= DIFFICULTY_THRESHOLDS.HARD) return "MEDIUM";
  return "HARDCORE";
}

/**
 * Determine trend direction by comparing current vs previous value.
 */
function determineTrend(current: number, previous: number, threshold = 0.05): TrendDirection {
  if (current > previous + threshold) return "UP";
  if (current < previous - threshold) return "DOWN";
  return "STABLE";
}

/**
 * Process all questions marked as needing reprocessing.
 * Computes full aggregate stats from QuestionAttemptLog.
 *
 * Returns the number of questions processed.
 */
export async function processPendingStats(batchSize = 100): Promise<number> {
  const pendingStats = await prisma.questionUsageStats.findMany({
    where: { needsProcessing: true },
    take: batchSize,
  });

  for (const stat of pendingStats) {
    const logs = await prisma.questionAttemptLog.findMany({
      where: { questionId: stat.questionId },
    });

    const timesAttempted = logs.length;
    const correctAttempts = logs.filter((l) => l.isCorrect).length;
    const incorrectAttempts = logs.filter((l) => l.isCorrect === false).length;
    const skippedAttempts = logs.filter((l) => l.isSkipped).length;

    // Time analytics
    const durations = logs.map((l) => l.duration).sort((a, b) => a - b);
    const totalDuration = durations.reduce((acc, d) => acc + d, 0);
    const averageTimeSpent = timesAttempted > 0 ? totalDuration / timesAttempted : 0;
    const medianTimeSpent = computeMedian(durations);
    const fastestTime = durations.length > 0 ? durations[0] : null;
    const slowestTime = durations.length > 0 ? durations[durations.length - 1] : null;
    const p90Time = durations.length > 0 ? computePercentile(durations, 90) : null;

    // Success rate
    const previousSuccessRate = stat.successRate;
    const successRate = timesAttempted > 0 ? correctAttempts / timesAttempted : 0;

    // Report count
    const reportCount = await prisma.report.count({
      where: { targetQuestionId: stat.questionId },
    });

    // Trends
    let successRateTrend: TrendDirection = stat.successRateTrend as TrendDirection;
    let attemptsTrend: TrendDirection = stat.attemptsTrend as TrendDirection;
    const previousReportCount = stat.reportCount;
    let reportsTrend: TrendDirection = stat.reportsTrend as TrendDirection;

    if (timesAttempted >= MIN_ATTEMPTS) {
      successRateTrend = determineTrend(successRate, previousSuccessRate);
      // For attempts trend, compare new total vs old total
      attemptsTrend = determineTrend(timesAttempted, stat.timesAttempted, timesAttempted * 0.05);
      // For reports trend
      if (reportCount > previousReportCount) reportsTrend = "UP";
      else if (reportCount === previousReportCount) reportsTrend = "STABLE";
      else reportsTrend = "DOWN";
    }

    // Actual difficulty (only with sufficient data)
    let actualDifficulty: ChallengeDifficulty | null = stat.actualDifficulty;
    if (timesAttempted >= MIN_ATTEMPTS) {
      actualDifficulty = classifyDifficultyFromRate(successRate);
    }

    // Data quality
    const dataQuality = classifyDataQuality(timesAttempted);

    await prisma.questionUsageStats.update({
      where: { id: stat.id },
      data: {
        timesAttempted,
        correctAttempts,
        incorrectAttempts,
        skippedAttempts,
        averageTimeSpent,
        medianTimeSpent,
        fastestTime,
        slowestTime,
        p90Time,
        successRate,
        reportCount,
        actualDifficulty,
        successRateTrend,
        attemptsTrend,
        reportsTrend,
        dataQuality,
        analyticsVersion: CURRENT_ANALYTICS_VERSION,
        lastCalculatedAt: new Date(),
        needsProcessing: false,
      },
    });
  }

  return pendingStats.length;
}

/**
 * Purge attempt logs older than retention window (90 days).
 * Returns the number of deleted records.
 */
export async function purgeOldAttemptLogs(): Promise<number> {
  const retentionDays = 90;
  const cutoff = subDays(new Date(), retentionDays);
  const result = await prisma.questionAttemptLog.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });
  return result.count;
}

/**
 * Force reprocess all usage stats (for analytics version bumps).
 */
export async function reprocessAllStats(): Promise<number> {
  const result = await prisma.questionUsageStats.updateMany({
    where: { analyticsVersion: { lt: CURRENT_ANALYTICS_VERSION } },
    data: { needsProcessing: true },
  });
  return result.count;
}
