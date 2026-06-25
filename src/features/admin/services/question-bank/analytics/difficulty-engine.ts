/**
 * QuizArena — Difficulty Engine
 *
 * Single responsibility: 5-level difficulty classification
 * and drift detection between configured vs actual difficulty.
 *
 * All computations are gated by MIN_ATTEMPTS.
 */

import { prisma } from "@/lib/prisma";
import {
  MIN_ATTEMPTS,
  DIFFICULTY_THRESHOLDS,
  ACTUAL_TO_CONFIGURED_MAP,
  type ActualDifficultyLevel,
} from "./constants";

export interface DifficultyDrift {
  hasDrift: boolean;
  configuredDifficulty: string;
  actualDifficulty: ActualDifficultyLevel | null;
  direction: "EASIER_THAN_EXPECTED" | "HARDER_THAN_EXPECTED" | null;
  severity: "MINOR" | "SIGNIFICANT" | "CRITICAL" | null;
}

/**
 * Classify a success rate into 5-level actual difficulty.
 */
export function classifyActualDifficulty(successRate: number): ActualDifficultyLevel {
  if (successRate >= DIFFICULTY_THRESHOLDS.VERY_EASY) return "VERY_EASY";
  if (successRate >= DIFFICULTY_THRESHOLDS.EASY) return "EASY";
  if (successRate >= DIFFICULTY_THRESHOLDS.MEDIUM) return "MEDIUM";
  if (successRate >= DIFFICULTY_THRESHOLDS.HARD) return "HARD";
  return "VERY_HARD";
}

/**
 * Detect drift between configured and actual difficulty.
 */
export function detectDifficultyDrift(
  configuredDifficulty: string,
  successRate: number,
  timesAttempted: number
): DifficultyDrift {
  if (timesAttempted < MIN_ATTEMPTS) {
    return {
      hasDrift: false,
      configuredDifficulty,
      actualDifficulty: null,
      direction: null,
      severity: null,
    };
  }

  const actualDifficulty = classifyActualDifficulty(successRate);
  const mappedConfigured = ACTUAL_TO_CONFIGURED_MAP[actualDifficulty];
  const hasDrift = mappedConfigured !== configuredDifficulty;

  if (!hasDrift) {
    return {
      hasDrift: false,
      configuredDifficulty,
      actualDifficulty,
      direction: null,
      severity: null,
    };
  }

  // Determine direction: if actual is easier than configured, question is easier than expected
  const difficultyOrder: ActualDifficultyLevel[] = [
    "VERY_EASY",
    "EASY",
    "MEDIUM",
    "HARD",
    "VERY_HARD",
  ];
  const configuredOrder: Record<string, number> = {
    BEGINNER: 0,
    MEDIUM: 2,
    HARDCORE: 4,
  };
  const actualIdx = difficultyOrder.indexOf(actualDifficulty);
  const configIdx = configuredOrder[configuredDifficulty] ?? 2;

  const direction =
    actualIdx < configIdx ? "EASIER_THAN_EXPECTED" : "HARDER_THAN_EXPECTED";

  // Severity based on distance
  const distance = Math.abs(actualIdx - configIdx);
  let severity: "MINOR" | "SIGNIFICANT" | "CRITICAL";
  if (distance >= 3) severity = "CRITICAL";
  else if (distance >= 2) severity = "SIGNIFICANT";
  else severity = "MINOR";

  return {
    hasDrift,
    configuredDifficulty,
    actualDifficulty,
    direction,
    severity,
  };
}

/**
 * Get full difficulty analysis for a question.
 */
export async function getQuestionDifficultyAnalysis(questionId: string) {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { usageStats: true },
  });

  if (!question) throw new Error("Question not found");

  const stats = question.usageStats;
  if (!stats || stats.timesAttempted < MIN_ATTEMPTS) {
    return {
      configuredDifficulty: question.difficulty,
      actualDifficulty: null as ActualDifficultyLevel | null,
      drift: {
        hasDrift: false,
        configuredDifficulty: question.difficulty,
        actualDifficulty: null,
        direction: null,
        severity: null,
      } as DifficultyDrift,
      insufficientData: true,
    };
  }

  const actualDifficulty = classifyActualDifficulty(stats.successRate);
  const drift = detectDifficultyDrift(
    question.difficulty,
    stats.successRate,
    stats.timesAttempted
  );

  return {
    configuredDifficulty: question.difficulty,
    actualDifficulty,
    drift,
    insufficientData: false,
  };
}
