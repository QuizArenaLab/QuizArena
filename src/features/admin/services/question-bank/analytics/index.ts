/**
 * QuizArena — Analytics Barrel Exports
 *
 * Re-exports all analytics services for clean imports.
 */

// Constants & types
export {
  MIN_ATTEMPTS,
  MEDIUM_ATTEMPTS,
  HIGH_ATTEMPTS,
  TREND_WINDOWS,
  DIFFICULTY_THRESHOLDS,
  FLAG_THRESHOLDS,
  DATA_QUALITY_THRESHOLDS,
  CURRENT_ANALYTICS_VERSION,
  CONFIDENCE_WEIGHTS,
  ACTUAL_TO_CONFIGURED_MAP,
  type ActualDifficultyLevel,
  type DynamicQuestionFlag,
  type TrendDirection,
  type TrendWindow,
  type BenchmarkPerformance,
} from "./constants";

// Attempt tracking
export { logQuestionAttempts, markQuestionsDirty } from "./attempt-tracker";

// Usage aggregation
export {
  processPendingStats,
  purgeOldAttemptLogs,
  reprocessAllStats,
} from "./usage-aggregator";

// Difficulty engine
export {
  classifyActualDifficulty,
  detectDifficultyDrift,
  getQuestionDifficultyAnalysis,
  type DifficultyDrift,
} from "./difficulty-engine";

// Benchmark engine
export {
  getQuestionBenchmark,
  type QuestionBenchmarks,
  type BenchmarkResult,
} from "./benchmark-engine";

// Recommendation engine
export {
  generateDynamicFlags,
  generateRecommendations,
  type Recommendation,
} from "./recommendation-engine";

// Trend engine
export {
  computeTrends,
  computeConfidenceScore,
  getConfidenceLabel,
  type TrendData,
  type TrendSummary,
} from "./trend-engine";

// Dashboard engine
export {
  getIntelligenceDashboardMetrics,
  getQuestionsByIntelligenceFilter,
  type IntelligenceDashboardMetrics,
} from "./dashboard-engine";

// Job runner
export { runAnalyticsJob, type JobResult, type JobType } from "./job-runner";
