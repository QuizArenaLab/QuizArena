/**
 * QuizArena — Analytics Constants
 *
 * All configurable thresholds for the Question Intelligence Engine.
 * Future changes to thresholds require no code modifications —
 * only these constants need updating.
 */

// ─── Sample Size Gates ──────────────────────────────────────────────────────
// No flags/benchmarks/recommendations below MIN_ATTEMPTS

export const MIN_ATTEMPTS = 50;
export const MEDIUM_ATTEMPTS = 100;
export const HIGH_ATTEMPTS = 200;

// ─── Trend Windows (days) ───────────────────────────────────────────────────

export const TREND_WINDOWS = {
  SHORT: 7,
  MEDIUM: 30,
  LONG: 90,
} as const;

export type TrendWindow = keyof typeof TREND_WINDOWS;

// ─── Difficulty Thresholds (success rate → actual difficulty) ────────────────

export const DIFFICULTY_THRESHOLDS = {
  VERY_EASY: 0.9, // ≥90%
  EASY: 0.7, // ≥70%
  MEDIUM: 0.5, // ≥50%
  HARD: 0.3, // ≥30%
  // <30% = VERY_HARD
} as const;

export type ActualDifficultyLevel = "VERY_EASY" | "EASY" | "MEDIUM" | "HARD" | "VERY_HARD";

// ─── Flag Thresholds ────────────────────────────────────────────────────────

export const FLAG_THRESHOLDS = {
  TOO_EASY_SR: 0.9,
  TOO_HARD_SR: 0.3,
  HIGH_SKIP_RATE: 0.2,
  HIGH_REPORT_RATE: 0.05,
  OVERUSED: 10000,
  UNUSED_DAYS: 30,
  STALE_DAYS: 180,
  DECLINING_DELTA: -0.1, // 10% drop = declining
} as const;

// ─── Data Quality Classification ────────────────────────────────────────────

export const DATA_QUALITY_THRESHOLDS = {
  HIGH: 200, // ≥200 attempts
  MEDIUM: 100, // ≥100 attempts
  LOW: 50, // ≥50 attempts
  // <50 = INSUFFICIENT
} as const;

// ─── Analytics Version ──────────────────────────────────────────────────────
// Increment when algorithm changes to trigger recalculation

export const CURRENT_ANALYTICS_VERSION = 1;

// ─── Dynamic Flag Types ─────────────────────────────────────────────────────

export type DynamicQuestionFlag =
  | "TOO_EASY"
  | "TOO_HARD"
  | "DIFFICULTY_DRIFT"
  | "HIGH_SKIP_RATE"
  | "HIGH_REPORT_RATE"
  | "LOW_CONFIDENCE"
  | "OVERUSED"
  | "UNUSED"
  | "DECLINING_PERFORMANCE"
  | "STALE"
  | "INSUFFICIENT_DATA"
  | "HEALTHY";

// ─── Confidence Score Weights ───────────────────────────────────────────────

export const CONFIDENCE_WEIGHTS = {
  ATTEMPT_VOLUME: 0.3,
  CONSISTENCY: 0.2,
  REPORT_RATE_INVERSE: 0.15,
  DIFFICULTY_STABILITY: 0.15,
  USAGE_STABILITY: 0.1,
  SAMPLE_SIZE: 0.1,
} as const;

// ─── Trend Directions ───────────────────────────────────────────────────────

export type TrendDirection = "UP" | "DOWN" | "STABLE";

// ─── Benchmark Performance Labels ───────────────────────────────────────────

export type BenchmarkPerformance = "ABOVE_AVERAGE" | "AVERAGE" | "BELOW_AVERAGE";

// ─── Mapping: 5-level actual → 3-level configured ──────────────────────────

export const ACTUAL_TO_CONFIGURED_MAP: Record<ActualDifficultyLevel, string> = {
  VERY_EASY: "BEGINNER",
  EASY: "BEGINNER",
  MEDIUM: "MEDIUM",
  HARD: "HARDCORE",
  VERY_HARD: "HARDCORE",
};
