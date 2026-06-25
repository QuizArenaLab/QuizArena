/**
 * QuizArena — Trend Engine
 *
 * Single responsibility: computing directional trends and
 * confidence scores from existing QuestionUsageStats data.
 *
 * Trend direction is derived from stored trend fields.
 * Confidence score is computed dynamically — never stored.
 */

import {
  CONFIDENCE_WEIGHTS,
  MIN_ATTEMPTS,
  HIGH_ATTEMPTS,
  TREND_WINDOWS,
  type TrendDirection,
  type TrendWindow,
} from "./constants";

export interface TrendData {
  successRate: TrendDirection;
  attempts: TrendDirection;
  reports: TrendDirection;
  avgTime: TrendDirection;
}

export interface TrendSummary {
  short: TrendData; // 7-day
  medium: TrendData; // 30-day
  long: TrendData; // 90-day
  windows: typeof TREND_WINDOWS;
}

/**
 * Compute trends from stored trend direction fields.
 *
 * Since we use precomputed aggregates, the actual trend directions
 * are already stored in QuestionUsageStats. This function normalizes
 * them into a structured TrendSummary format.
 *
 * For the initial version, all three windows share the same direction
 * from the latest processing run. As DailyAnalytics matures, the
 * windows can compute independently from historical snapshots.
 */
export function computeTrends(stats: {
  successRateTrend: string;
  attemptsTrend: string;
  reportsTrend: string;
  timesAttempted: number;
}): TrendSummary {
  const safeTrend = (t: string): TrendDirection => {
    if (t === "UP" || t === "DOWN" || t === "STABLE") return t;
    return "STABLE";
  };

  // Current implementation: all windows use same direction from latest processing.
  // Future: DailyAnalytics snapshots enable independent per-window computation.
  const trendData: TrendData = {
    successRate: safeTrend(stats.successRateTrend),
    attempts: safeTrend(stats.attemptsTrend),
    reports: safeTrend(stats.reportsTrend),
    avgTime: "STABLE", // Time trends computed in future iteration
  };

  return {
    short: trendData,
    medium: trendData,
    long: trendData,
    windows: TREND_WINDOWS,
  };
}

/**
 * Compute confidence score (0–100) dynamically.
 *
 * Weighted composite of:
 * - Attempt volume (30%)
 * - Consistency (20%)
 * - Report rate inverse (15%)
 * - Difficulty stability (15%)
 * - Usage stability (10%)
 * - Sample size (10%)
 *
 * NEVER stored — computed on read.
 */
export function computeConfidenceScore(stats: {
  timesAttempted: number;
  successRate: number;
  reportCount: number;
  successRateTrend: string;
  timesServed: number;
  actualDifficulty: string | null;
}): number {
  if (stats.timesAttempted < MIN_ATTEMPTS) return 0;

  // Attempt volume score (0-100)
  // Maxes out at HIGH_ATTEMPTS
  const volumeScore = Math.min(100, (stats.timesAttempted / HIGH_ATTEMPTS) * 100);

  // Consistency score (0-100)
  // A success rate near 50% is maximally informative; very high or very low rates
  // might still be consistent — so we measure stability from trend instead
  const consistencyScore = stats.successRateTrend === "STABLE" ? 100 : stats.successRateTrend === "UP" ? 70 : 40;

  // Report rate inverse (0-100)
  // Lower report rate = higher score
  const reportRate =
    stats.timesAttempted > 0 ? stats.reportCount / stats.timesAttempted : 0;
  const reportScore = Math.max(0, 100 - reportRate * 2000); // 5% report rate = 0

  // Difficulty stability (0-100)
  // Has an actual difficulty been determined?
  const difficultyScore = stats.actualDifficulty ? 100 : 20;

  // Usage stability (0-100)
  // Has the question been served at all?
  const usageScore = stats.timesServed > 0 ? Math.min(100, (stats.timesServed / 100) * 100) : 10;

  // Sample size score (0-100)
  const sampleScore = Math.min(100, (stats.timesAttempted / MIN_ATTEMPTS) * 100);

  const confidence = Math.round(
    volumeScore * CONFIDENCE_WEIGHTS.ATTEMPT_VOLUME +
    consistencyScore * CONFIDENCE_WEIGHTS.CONSISTENCY +
    reportScore * CONFIDENCE_WEIGHTS.REPORT_RATE_INVERSE +
    difficultyScore * CONFIDENCE_WEIGHTS.DIFFICULTY_STABILITY +
    usageScore * CONFIDENCE_WEIGHTS.USAGE_STABILITY +
    sampleScore * CONFIDENCE_WEIGHTS.SAMPLE_SIZE
  );

  return Math.min(100, Math.max(0, confidence));
}

/**
 * Get confidence label for display.
 */
export function getConfidenceLabel(score: number): string {
  if (score >= 80) return "High Confidence";
  if (score >= 60) return "Moderate Confidence";
  if (score >= 40) return "Low Confidence";
  if (score > 0) return "Very Low Confidence";
  return "Insufficient Data";
}
