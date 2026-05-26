"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Initializes a new quiz attempt for a user.
 */
export async function startAttempt(userId: string, challengeId: string) {
  // 1. Fetch challenge and validate
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      questions: {
        include: { question: { include: { options: true } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  if (challenge.status !== "LIVE" && challenge.status !== "SCHEDULED") {
    throw new Error("Challenge is not available");
  }

  // 2. Check for existing attempt
  const existingAttempt = await prisma.attempt.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId,
      },
    },
  });

  if (existingAttempt) {
    if (existingAttempt.status === "SUBMITTED" || existingAttempt.status === "EVALUATED") {
      throw new Error("You have already submitted this challenge.");
    }
    // Return existing active attempt to recover
    return existingAttempt;
  }

  // 3. Randomize Question and Option Order
  const questionOrder = challenge.questions.map((cq) => cq.questionId);
  for (let i = questionOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionOrder[i], questionOrder[j]] = [questionOrder[j], questionOrder[i]];
  }

  const optionOrders: Record<string, string[]> = {};
  challenge.questions.forEach((cq) => {
    const options = [...cq.question.options.map((o) => o.id)];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    optionOrders[cq.questionId] = options;
  });

  const now = new Date();
  const expiresAt = new Date(now.getTime() + challenge.durationInMinutes * 60000);

  // 4. Create Attempt
  const attempt = await prisma.attempt.create({
    data: {
      userId,
      challengeId,
      startedAt: now,
      expiresAt: expiresAt,
      status: "IN_PROGRESS",
      questionOrder: questionOrder,
      optionOrders: optionOrders,
    },
  });

  revalidatePath(`/challenges/${challenge.slug}/attempt`);
  return attempt;
}

/**
 * Recovers an active attempt.
 */
export async function recoverAttempt(attemptId: string) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      answers: true,
      challenge: {
        include: {
          questions: {
            include: { question: { include: { options: true } } },
          },
        },
      },
    },
  });

  if (!attempt) {
    throw new Error("Attempt not found");
  }

  return attempt;
}

/**
 * Autosaves an answer.
 */
export async function saveAnswer(attemptId: string, questionId: string, selectedOptionId: string) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
  });

  if (!attempt) throw new Error("Attempt not found");
  if (attempt.status !== "IN_PROGRESS") throw new Error("Attempt is no longer in progress");

  if (attempt.expiresAt && new Date() > attempt.expiresAt) {
    // If expired, trigger auto-submit and return error
    await submitAttempt(attemptId, true);
    throw new Error("Timer has expired");
  }

  const answer = await prisma.attemptAnswer.upsert({
    where: {
      attemptId_questionId: {
        attemptId,
        questionId,
      },
    },
    update: {
      selectedOptionId,
      answeredAt: new Date(),
    },
    create: {
      attemptId,
      questionId,
      selectedOptionId,
      answeredAt: new Date(),
    },
  });

  // Update totalAnswered asynchronously or just recalculate during submit.
  // We'll increment totalAnswered count if it's a new create? Upsert handles it.
  const totalAnswered = await prisma.attemptAnswer.count({
    where: { attemptId },
  });

  await prisma.attempt.update({
    where: { id: attemptId },
    data: { totalAnswered },
  });

  return answer;
}

/**
 * Submits an attempt and performs evaluation.
 */
export async function submitAttempt(attemptId: string, isAutoSubmitted = false) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      answers: true,
      challenge: {
        include: {
          questions: {
            include: { question: { include: { options: true } } },
          },
        },
      },
    },
  });

  if (!attempt) throw new Error("Attempt not found");
  if (attempt.status !== "IN_PROGRESS") return attempt; // Already submitted

  let correctAnswersCount = 0;
  let totalScore = 0;

  // Evaluation Map
  const correctOptionMap = new Map();
  attempt.challenge.questions.forEach((cq) => {
    const correctOption = cq.question.options.find((o) => o.isCorrect);
    if (correctOption) {
      correctOptionMap.set(cq.questionId, correctOption.id);
    }
  });

  // Evaluate
  const evaluatedAnswers = attempt.answers.map((ans) => {
    const isCorrect = correctOptionMap.get(ans.questionId) === ans.selectedOptionId;
    if (isCorrect) {
      correctAnswersCount++;
      const q = attempt.challenge.questions.find(
        (cq) => cq.questionId === ans.questionId
      )?.question;
      if (q) {
        totalScore += q.marks;
      }
    }
    return {
      ...ans,
      isCorrect,
    };
  });

  // Update answers in DB (bulk update is complex, updating loop is fine for MVP)
  for (const ans of evaluatedAnswers) {
    if (ans.isCorrect !== undefined) {
      await prisma.attemptAnswer.update({
        where: { id: ans.id },
        data: { isCorrect: ans.isCorrect },
      });
    }
  }

  const now = new Date();
  const timeTakenInSeconds = Math.floor((now.getTime() - attempt.startedAt.getTime()) / 1000);

  const updatedAttempt = await prisma.attempt.update({
    where: { id: attemptId },
    data: {
      status: "EVALUATED",
      submittedAt: now,
      isAutoSubmitted,
      correctAnswers: correctAnswersCount,
      score: totalScore,
      timeTakenInSeconds,
    },
  });

  return updatedAttempt;
}

/**
 * Tracks an anti-cheat violation (tab switch or blur).
 */
export async function trackViolation(
  attemptId: string,
  type: "TAB_SWITCH" | "WINDOW_BLUR" | "COPY_ATTEMPT" | "RIGHT_CLICK"
) {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
  });

  if (!attempt || attempt.status !== "IN_PROGRESS") return;

  const dataToUpdate: Record<string, any> = {
    totalViolations: attempt.totalViolations + 1,
  };

  if (type === "TAB_SWITCH") {
    dataToUpdate.tabSwitchCount = attempt.tabSwitchCount + 1;
  } else if (type === "WINDOW_BLUR") {
    dataToUpdate.blurCount = attempt.blurCount + 1;
  }

  // If violations exceed threshold, flag attempt
  if (dataToUpdate.totalViolations >= 5) {
    dataToUpdate.isFlagged = true;
  }

  await prisma.attempt.update({
    where: { id: attemptId },
    data: dataToUpdate,
  });

  // Log specific violation
  const existingLog = await prisma.antiCheatLog.findUnique({
    where: { attemptId_violationType: { attemptId, violationType: type } },
  });

  if (existingLog) {
    await prisma.antiCheatLog.update({
      where: { id: existingLog.id },
      data: { count: existingLog.count + 1, reportedAt: new Date() },
    });
  } else {
    await prisma.antiCheatLog.create({
      data: {
        attemptId,
        violationType: type,
        count: 1,
      },
    });
  }
}
