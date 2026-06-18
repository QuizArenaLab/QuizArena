import { prisma } from "@/lib/prisma";
import {
  LifecycleState,
  FreshnessStatus,
  RetirementRisk,
  QuestionCategory,
  TriggerSource,
} from "@/generated/prisma";

export type SignalSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

const MINIMUM_ATTEMPTS_REQUIRED = 50;

// Age thresholds in days
const OVERUSED_AGE_DAYS = 180;
const UNUSED_AGE_DAYS = 30;
const OUTDATED_AGE_DAYS = 365;

// Other thresholds
const OVERUSED_ATTEMPTS_THRESHOLD = 10000;
const LOW_SUCCESS_RATE_THRESHOLD = 0.2;
const EXCESSIVE_SUCCESS_RATE_THRESHOLD = 0.95;

export interface GeneratedSignal {
  type: string;
  severity: SignalSeverity;
  message: string;
}

export async function evaluateQuestionLifecycle(questionId: string) {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { usageStats: true, analytics: true, reports: true },
  });

  if (!question) throw new Error("Question not found");

  const usageStats = question.usageStats;
  const totalAttempts = usageStats?.timesAttempted || question.analytics?.totalAttempts || 0;

  // Calculate Age in days
  const now = new Date();
  const ageInDays = Math.floor(
    (now.getTime() - question.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  let newState = question.lifecycleState;
  let newFreshness = question.freshnessStatus;
  let newRisk = question.retirementRisk;
  const newCategory = question.questionCategory;

  const signals: GeneratedSignal[] = [];

  // Determine Freshness (Only DYNAMIC questions receive freshness penalties)
  if (newCategory === QuestionCategory.DYNAMIC) {
    if (ageInDays > OUTDATED_AGE_DAYS) {
      newFreshness = FreshnessStatus.OUTDATED;
    } else if (ageInDays > OVERUSED_AGE_DAYS) {
      newFreshness = FreshnessStatus.AGING;
    } else {
      newFreshness = FreshnessStatus.FRESH;
    }
  }

  // 1. Minimum Sample Size Check
  if (totalAttempts < MINIMUM_ATTEMPTS_REQUIRED) {
    newState = LifecycleState.INSUFFICIENT_DATA;
    // Cannot receive difficulty drift, success rate, or retirement signals
  } else {
    // Has enough data (>= 50 attempts)
    const successRate = usageStats?.successRate || question.analytics?.accuracyRate || 0;
    const decliningUsageTrend = usageStats?.attemptsTrend === "DOWN";

    // Rule 1: Overused -> Retirement Candidate
    if (
      totalAttempts > OVERUSED_ATTEMPTS_THRESHOLD &&
      ageInDays > OVERUSED_AGE_DAYS &&
      decliningUsageTrend
    ) {
      newState = LifecycleState.RETIREMENT_CANDIDATE;
      newRisk = RetirementRisk.HIGH;
      signals.push({
        type: "OVERUSED",
        severity: "HIGH",
        message: "Question is overused with a declining usage trend.",
      });
    }
    // Rule 5: Low Success Rate (< 20%) -> Flagged
    else if (successRate < LOW_SUCCESS_RATE_THRESHOLD) {
      newState = LifecycleState.FLAGGED;
      signals.push({
        type: "LOW_SUCCESS_RATE",
        severity: "MEDIUM",
        message: "Success rate is below 20%.",
      });
    }
    // Rule 6: Excessive Success Rate (> 95%) -> Refresh Required
    else if (successRate > EXCESSIVE_SUCCESS_RATE_THRESHOLD) {
      newState = LifecycleState.REFRESH_REQUIRED;
      signals.push({
        type: "EXCESSIVE_SUCCESS_RATE",
        severity: "LOW",
        message: "Success rate is above 95%.",
      });
    }
    // Rule 4: Difficulty Drift -> Monitoring
    else if (usageStats?.actualDifficulty && usageStats.actualDifficulty !== question.difficulty) {
      newState = LifecycleState.MONITORING;
      signals.push({
        type: "DIFFICULTY_DRIFT",
        severity: "LOW",
        message: `Difficulty drifted to ${usageStats.actualDifficulty}.`,
      });
    } else {
      newState = LifecycleState.HEALTHY;
    }
  }

  // Rule 2: Unused -> Monitoring
  if (question.isActive && totalAttempts === 0 && ageInDays > UNUSED_AGE_DAYS) {
    newState = LifecycleState.MONITORING;
    signals.push({
      type: "UNUSED",
      severity: "LOW",
      message: "Published but unused for 30+ days.",
    });
  }

  // Rule 3: High Report Rate -> Flagged
  const reportCount = question.reports?.length || 0;
  if (reportCount > 5) {
    newState = LifecycleState.FLAGGED;
    signals.push({
      type: "HIGH_REPORT_RATE",
      severity: "HIGH",
      message: "High volume of reports.",
    });
  }

  // Rule 7: Outdated Content -> Refresh Required
  if (newCategory === QuestionCategory.DYNAMIC && ageInDays > OUTDATED_AGE_DAYS) {
    newState = LifecycleState.REFRESH_REQUIRED;
    signals.push({
      type: "OUTDATED_CONTENT",
      severity: "MEDIUM",
      message: "Content is older than 365 days.",
    });
  }

  // Calculate Governance Score (0-100)
  let governanceScore = 100;
  if (newState === LifecycleState.INSUFFICIENT_DATA) {
    governanceScore = 50; // Neutral score for insufficient data
  } else {
    if (reportCount > 0) governanceScore -= reportCount * 5;
    if (newFreshness === FreshnessStatus.OUTDATED) governanceScore -= 20;
    else if (newFreshness === FreshnessStatus.AGING) governanceScore -= 10;
    if (newRisk === RetirementRisk.HIGH) governanceScore -= 30;
  }
  governanceScore = Math.max(0, Math.min(100, governanceScore));

  const previousState = question.lifecycleState;

  // Persist
  await prisma.$transaction(async (tx) => {
    await tx.question.update({
      where: { id: questionId },
      data: {
        lifecycleState: newState,
        freshnessStatus: newFreshness,
        retirementRisk: newRisk,
        governanceScore: governanceScore,
        lastGovernanceEvaluation: new Date(),
        governanceVersion: { increment: 1 },
      },
    });

    if (previousState !== newState) {
      await tx.questionGovernanceAudit.create({
        data: {
          questionId,
          action: "LIFECYCLE_EVALUATION",
          reason: `Automated evaluation changed state from ${previousState} to ${newState}`,
          triggerSource: TriggerSource.SYSTEM,
          previousState: previousState,
          newState: newState,
        },
      });
    }
  });

  return { newState, signals, governanceScore };
}

/**
 * Runs the evaluation engine for all active questions.
 * This should be triggered by a scheduled job (e.g., daily cron).
 */
export async function evaluateAllActiveQuestions() {
  const questions = await prisma.question.findMany({
    where: { isActive: true },
    select: { id: true },
  });

  let processed = 0;
  let errors = 0;

  for (const q of questions) {
    try {
      await evaluateQuestionLifecycle(q.id);
      processed++;
    } catch (error) {
      console.error(`Failed to evaluate question ${q.id}:`, error);
      errors++;
    }
  }

  return { processed, errors, total: questions.length };
}
