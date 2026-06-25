/**
 * QuizArena — Attempt Tracker
 *
 * Single responsibility: recording question attempts and marking
 * questions as needing reprocessing.
 *
 * Write-path only — never used during dashboard rendering.
 */

import { prisma } from "@/lib/prisma";

export interface AttemptInput {
  userId: string;
  questionId: string;
  challengeId?: string;
  duration: number;
  answerSelected?: string;
  isCorrect?: boolean;
  isSkipped?: boolean;
  isTimeout?: boolean;
}

/**
 * Log question attempts and mark affected questions for reprocessing.
 * This is the ONLY write-path for attempt data.
 */
export async function logQuestionAttempts(attempts: AttemptInput[]) {
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
  await markQuestionsDirty(questionIds);
}

/**
 * Mark questions as needing analytics reprocessing.
 */
export async function markQuestionsDirty(questionIds: string[]) {
  for (const qId of questionIds) {
    await prisma.questionUsageStats.upsert({
      where: { questionId: qId },
      update: { needsProcessing: true, lastAttemptedAt: new Date() },
      create: { questionId: qId, needsProcessing: true, lastAttemptedAt: new Date() },
    });
  }
}
