/**
 * QuizArena — Recommendation Engine
 *
 * Single responsibility: dynamic recommendation generation.
 * Recommendations are NEVER stored. Only dismissals are persisted.
 *
 * All computations gated by MIN_ATTEMPTS.
 */

import { prisma } from "@/lib/prisma";
import { isBefore, subDays } from "date-fns";
import {
  MIN_ATTEMPTS,
  FLAG_THRESHOLDS,
  type DynamicQuestionFlag,
} from "./constants";
import { classifyActualDifficulty, detectDifficultyDrift } from "./difficulty-engine";
import { computeConfidenceScore } from "./trend-engine";

export interface Recommendation {
  type: string;
  title: string;
  message: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}

/**
 * Generate dynamic flags for a question based on its usage stats.
 * Flags are NEVER persisted — computed on demand.
 */
export function generateDynamicFlags(
  stats: {
    timesAttempted: number;
    successRate: number;
    skippedAttempts: number;
    timesServed: number;
    reportCount: number;
    successRateTrend: string;
    lastServedAt: Date | null;
    actualDifficulty: string | null;
  },
  configuredDifficulty: string,
  questionCreatedAt: Date,
  questionStatus: string
): DynamicQuestionFlag[] {
  if (stats.timesAttempted < MIN_ATTEMPTS) {
    return ["INSUFFICIENT_DATA"];
  }

  const flags: DynamicQuestionFlag[] = [];

  // Success rate flags
  if (stats.successRate >= FLAG_THRESHOLDS.TOO_EASY_SR) {
    flags.push("TOO_EASY");
  } else if (stats.successRate <= FLAG_THRESHOLDS.TOO_HARD_SR) {
    flags.push("TOO_HARD");
  }

  // Difficulty drift
  if (stats.actualDifficulty && stats.actualDifficulty !== configuredDifficulty) {
    const drift = detectDifficultyDrift(
      configuredDifficulty,
      stats.successRate,
      stats.timesAttempted
    );
    if (drift.hasDrift) {
      flags.push("DIFFICULTY_DRIFT");
    }
  }

  // Skip rate
  const skipRate =
    stats.timesAttempted > 0 ? stats.skippedAttempts / stats.timesAttempted : 0;
  if (skipRate >= FLAG_THRESHOLDS.HIGH_SKIP_RATE) {
    flags.push("HIGH_SKIP_RATE");
  }

  // Report rate
  const reportRate =
    stats.timesAttempted > 0 ? stats.reportCount / stats.timesAttempted : 0;
  if (reportRate >= FLAG_THRESHOLDS.HIGH_REPORT_RATE) {
    flags.push("HIGH_REPORT_RATE");
  }

  // Overused
  if (
    stats.timesServed >= FLAG_THRESHOLDS.OVERUSED ||
    stats.timesAttempted >= FLAG_THRESHOLDS.OVERUSED
  ) {
    flags.push("OVERUSED");
  }

  // Unused
  if (
    stats.lastServedAt &&
    isBefore(stats.lastServedAt, subDays(new Date(), FLAG_THRESHOLDS.UNUSED_DAYS))
  ) {
    flags.push("UNUSED");
  } else if (
    !stats.lastServedAt &&
    questionStatus === "APPROVED" &&
    isBefore(questionCreatedAt, subDays(new Date(), FLAG_THRESHOLDS.UNUSED_DAYS))
  ) {
    flags.push("UNUSED");
  }

  // Declining performance
  if (stats.successRateTrend === "DOWN") {
    flags.push("DECLINING_PERFORMANCE");
  }

  // Stale
  if (isBefore(questionCreatedAt, subDays(new Date(), FLAG_THRESHOLDS.STALE_DAYS))) {
    if (flags.includes("OVERUSED") || flags.includes("DECLINING_PERFORMANCE")) {
      flags.push("STALE");
    }
  }

  // Low confidence
  const confidence = computeConfidenceScore(stats);
  if (confidence < 40) {
    flags.push("LOW_CONFIDENCE");
  }

  // Healthy if no negative flags
  if (flags.length === 0) {
    flags.push("HEALTHY");
  }

  return flags;
}

/**
 * Generate actionable recommendations for a question.
 * Checks dismissed recommendations and excludes them.
 */
export async function generateRecommendations(
  questionId: string
): Promise<Recommendation[]> {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      usageStats: true,
      recommendationDismissals: true,
    },
  });

  if (!question) throw new Error("Question not found");

  const stats = question.usageStats;
  if (!stats || stats.timesAttempted < MIN_ATTEMPTS) {
    return [];
  }

  const recommendations: Recommendation[] = [];
  const dismissedTypes = question.recommendationDismissals.map(
    (d) => d.recommendationType
  );

  // Difficulty drift recommendation
  const drift = detectDifficultyDrift(
    question.difficulty,
    stats.successRate,
    stats.timesAttempted
  );
  if (drift.hasDrift && !dismissedTypes.includes("DIFFICULTY_DRIFT")) {
    const actual = classifyActualDifficulty(stats.successRate);
    recommendations.push({
      type: "DIFFICULTY_DRIFT",
      title: "Difficulty Mismatch Detected",
      message: `Question appears to perform as ${actual.replace(/_/g, " ")} but is configured as ${question.difficulty}. Consider adjusting the difficulty setting.`,
      severity: drift.severity === "CRITICAL" ? "CRITICAL" : "WARNING",
    });
  }

  // Declining performance
  if (
    stats.successRateTrend === "DOWN" &&
    !dismissedTypes.includes("DECLINING_PERFORMANCE")
  ) {
    recommendations.push({
      type: "DECLINING_PERFORMANCE",
      title: "Performance Declining",
      message:
        "Success rate has been declining over the recent trend window. Review question wording and answer options.",
      severity: "WARNING",
    });
  }

  // High skip rate
  const skipRate = stats.skippedAttempts / stats.timesAttempted;
  if (
    skipRate >= FLAG_THRESHOLDS.HIGH_SKIP_RATE &&
    !dismissedTypes.includes("HIGH_SKIP_RATE")
  ) {
    recommendations.push({
      type: "HIGH_SKIP_RATE",
      title: "High Skip Rate",
      message: `${(skipRate * 100).toFixed(0)}% of users skip this question. Review the explanation and consider simplifying the wording.`,
      severity: "WARNING",
    });
  }

  // High report rate
  const reportRate = stats.reportCount / stats.timesAttempted;
  if (
    reportRate >= FLAG_THRESHOLDS.HIGH_REPORT_RATE &&
    !dismissedTypes.includes("HIGH_REPORT_RATE")
  ) {
    recommendations.push({
      type: "HIGH_REPORT_RATE",
      title: "High Report Rate",
      message: `This question has ${stats.reportCount} reports. Review for accuracy and clarity.`,
      severity: "CRITICAL",
    });
  }

  // Unused
  if (
    stats.lastServedAt &&
    isBefore(stats.lastServedAt, subDays(new Date(), FLAG_THRESHOLDS.UNUSED_DAYS)) &&
    !dismissedTypes.includes("UNUSED")
  ) {
    recommendations.push({
      type: "UNUSED",
      title: "Question Not in Rotation",
      message:
        "This question hasn't been served in 30+ days. Consider adding it back into active rotation.",
      severity: "INFO",
    });
  }

  // Too easy
  if (
    stats.successRate >= FLAG_THRESHOLDS.TOO_EASY_SR &&
    !dismissedTypes.includes("TOO_EASY")
  ) {
    recommendations.push({
      type: "TOO_EASY",
      title: "Question May Be Too Easy",
      message: `Success rate of ${(stats.successRate * 100).toFixed(0)}% suggests this question is significantly easier than intended.`,
      severity: "INFO",
    });
  }

  // Too hard
  if (
    stats.successRate <= FLAG_THRESHOLDS.TOO_HARD_SR &&
    !dismissedTypes.includes("TOO_HARD")
  ) {
    recommendations.push({
      type: "TOO_HARD",
      title: "Question May Be Too Hard",
      message: `Success rate of ${(stats.successRate * 100).toFixed(0)}% suggests this question is significantly harder than intended. Review for clarity.`,
      severity: "WARNING",
    });
  }

  return recommendations;
}
