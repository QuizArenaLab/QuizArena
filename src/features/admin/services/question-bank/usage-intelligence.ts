import { prisma } from "@/lib/prisma";
import { ChallengeDifficulty, QuestionStatus } from "@/generated/prisma";
import { subDays, isBefore } from "date-fns";

const MIN_ATTEMPTS = 50;
const OVERUSED_THRESHOLD = 10000;
const UNUSED_DAYS = 30;
const OLD_DAYS = 180;
const TOO_EASY_SR = 0.8;
const TOO_HARD_SR = 0.5;
const VERY_HARD_SR = 0.25;
const HIGH_SKIP_RATE = 0.2;
const HIGH_REPORT_RATE = 0.05;

export type DynamicQuestionFlag =
  | "TOO_EASY"
  | "TOO_HARD"
  | "VERY_HARD"
  | "OVERUSED"
  | "UNUSED"
  | "HIGH_SKIP_RATE"
  | "HIGH_REPORT_RATE"
  | "DIFFICULTY_DRIFT"
  | "RETIREMENT_CANDIDATE"
  | "HEALTHY";

export interface QuestionIntelligence {
  usageStats: {
    timesAttempted: number;
    successRate: number;
    skippedAttempts: number;
    timesServed: number;
    lastServedAt: Date | null;
    averageTimeSpent: number;
    actualDifficulty: ChallengeDifficulty | null;
    successRateTrend: string;
    attemptsTrend: string;
    reportsTrend: string;
  };
  dynamicFlags: DynamicQuestionFlag[];
  recommendations: Array<{ type: string; message: string }>;
  insufficientData: boolean;
}

export async function logQuestionAttempts(
  attempts: Array<{
    userId: string;
    questionId: string;
    challengeId?: string;
    duration: number;
    answerSelected?: string;
    isCorrect?: boolean;
    isSkipped?: boolean;
    isTimeout?: boolean;
  }>
) {
  if (attempts.length === 0) return;

  await prisma.questionAttemptLog.createMany({
    data: attempts.map((a) => ({
      userId: a.userId,
      questionId: a.questionId,
      challengeId: a.challengeId,
      duration: a.duration,
      answerSelected: a.answerSelected,
      isCorrect: a.isCorrect,
      isSkipped: a.isSkipped,
      isTimeout: a.isTimeout,
    })),
  });

  const questionIds = [...new Set(attempts.map((a) => a.questionId))];

  for (const qId of questionIds) {
    await prisma.questionUsageStats.upsert({
      where: { questionId: qId },
      update: { needsProcessing: true, lastAttemptedAt: new Date() },
      create: { questionId: qId, needsProcessing: true, lastAttemptedAt: new Date() },
    });
  }
}

export async function processPendingStats(batchSize = 100) {
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
    const totalDuration = logs.reduce((acc, l) => acc + l.duration, 0);
    const averageTimeSpent = timesAttempted > 0 ? totalDuration / timesAttempted : 0;

    const previousSuccessRate = stat.successRate;
    const successRate = timesAttempted > 0 ? correctAttempts / timesAttempted : 0;

    let successRateTrend = stat.successRateTrend;
    if (timesAttempted > MIN_ATTEMPTS) {
      if (successRate > previousSuccessRate + 0.05) successRateTrend = "UP";
      else if (successRate < previousSuccessRate - 0.05) successRateTrend = "DOWN";
      else successRateTrend = "STABLE";
    }

    let actualDifficulty: ChallengeDifficulty | null = null;
    if (timesAttempted >= MIN_ATTEMPTS) {
      if (successRate >= TOO_EASY_SR) actualDifficulty = "BEGINNER";
      else if (successRate >= TOO_HARD_SR) actualDifficulty = "MEDIUM";
      else actualDifficulty = "HARDCORE";
    }

    await prisma.questionUsageStats.update({
      where: { id: stat.id },
      data: {
        timesAttempted,
        correctAttempts,
        incorrectAttempts,
        skippedAttempts,
        averageTimeSpent,
        successRate,
        actualDifficulty,
        successRateTrend,
        needsProcessing: false,
      },
    });
  }
}

export async function purgeOldAttemptLogs() {
  const ninetyDaysAgo = subDays(new Date(), 90);
  await prisma.questionAttemptLog.deleteMany({
    where: { createdAt: { lt: ninetyDaysAgo } },
  });
}

export async function getQuestionIntelligence(questionId: string): Promise<QuestionIntelligence> {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      usageStats: true,
      reports: true,
      recommendationDismissals: true,
    },
  });

  if (!question) throw new Error("Question not found");

  const stats = question.usageStats || {
    timesAttempted: 0,
    successRate: 0,
    skippedAttempts: 0,
    timesServed: 0,
    lastServedAt: null,
    averageTimeSpent: 0,
    actualDifficulty: null,
    successRateTrend: "STABLE",
    attemptsTrend: "STABLE",
    reportsTrend: "STABLE",
  };

  const dynamicFlags: DynamicQuestionFlag[] = [];
  const recommendations: Array<{ type: string; message: string }> = [];

  const insufficientData = stats.timesAttempted < MIN_ATTEMPTS;

  if (insufficientData) {
    return { usageStats: stats, dynamicFlags, recommendations, insufficientData };
  }

  if (stats.successRate >= TOO_EASY_SR) dynamicFlags.push("TOO_EASY");
  else if (stats.successRate < VERY_HARD_SR) dynamicFlags.push("VERY_HARD");
  else if (stats.successRate < TOO_HARD_SR) dynamicFlags.push("TOO_HARD");

  if (stats.timesServed >= OVERUSED_THRESHOLD || stats.timesAttempted >= OVERUSED_THRESHOLD)
    dynamicFlags.push("OVERUSED");

  if (stats.lastServedAt && isBefore(stats.lastServedAt, subDays(new Date(), UNUSED_DAYS))) {
    dynamicFlags.push("UNUSED");
  } else if (
    !stats.lastServedAt &&
    question.status === "APPROVED" &&
    isBefore(question.createdAt, subDays(new Date(), UNUSED_DAYS))
  ) {
    dynamicFlags.push("UNUSED");
  }

  const skipRate = stats.skippedAttempts / stats.timesAttempted;
  if (skipRate >= HIGH_SKIP_RATE) dynamicFlags.push("HIGH_SKIP_RATE");

  const reportRate = question.reports.length / stats.timesAttempted;
  if (reportRate >= HIGH_REPORT_RATE) dynamicFlags.push("HIGH_REPORT_RATE");

  if (stats.actualDifficulty && stats.actualDifficulty !== question.difficulty) {
    dynamicFlags.push("DIFFICULTY_DRIFT");
  }

  const isOld = isBefore(question.createdAt, subDays(new Date(), OLD_DAYS));
  if (isOld && dynamicFlags.includes("OVERUSED") && stats.successRate < TOO_HARD_SR) {
    dynamicFlags.push("RETIREMENT_CANDIDATE");
  }

  if (dynamicFlags.length === 0) {
    dynamicFlags.push("HEALTHY");
  }

  const dismissedRecs = question.recommendationDismissals.map((d) => d.recommendationType);

  if (dynamicFlags.includes("DIFFICULTY_DRIFT") && !dismissedRecs.includes("DIFFICULTY_DRIFT")) {
    recommendations.push({
      type: "DIFFICULTY_DRIFT",
      message: `Question appears to be ${stats.actualDifficulty} but is configured as ${question.difficulty}. Consider adjusting.`,
    });
  }

  if (
    dynamicFlags.includes("RETIREMENT_CANDIDATE") &&
    !dismissedRecs.includes("RETIREMENT_CANDIDATE")
  ) {
    recommendations.push({
      type: "RETIREMENT_CANDIDATE",
      message: `Question is overused, old, and has low engagement. Consider archiving.`,
    });
  }

  if (dynamicFlags.includes("UNUSED") && !dismissedRecs.includes("UNUSED")) {
    recommendations.push({
      type: "UNUSED",
      message: `Question hasn't been served in 30+ days. Consider adding to rotation.`,
    });
  }

  return { usageStats: stats, dynamicFlags, recommendations, insufficientData };
}

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
