"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import type {
  ChallengeWithQuestionsForAttempt,
  ChallengeStartResult,
  ChallengeSubmitResult,
  AttemptWithDetails,
  QuizAnswerState,
  ShuffledOption,
} from "@/types/challenge";

// ─── Helpers ─────────────────────────────────────────────────────

/**
 * Deterministic shuffle using a seed derived from attemptId + salt.
 * Same seed always produces the same shuffle order — critical for refresh recovery.
 */
function seededShuffle<T>(array: T[], seed: string): T[] {
  const result = [...array];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  for (let i = result.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    const j = hash % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Check if an attempt's timer has expired based on server time.
 * This is the AUTHORITATIVE timer check — client timer is cosmetic only.
 */
function isTimerExpired(startedAt: Date, durationInMinutes: number): boolean {
  const deadline = new Date(startedAt.getTime() + durationInMinutes * 60 * 1000);
  return new Date() >= deadline;
}

/**
 * Calculate remaining seconds for an attempt.
 */
function getRemainingSeconds(startedAt: Date, durationInMinutes: number): number {
  const deadline = new Date(startedAt.getTime() + durationInMinutes * 60 * 1000);
  const remaining = Math.floor((deadline.getTime() - Date.now()) / 1000);
  return Math.max(0, remaining);
}

// ─── Challenge Queries ───────────────────────────────────────────

export async function getActiveChallenges() {
  // On-access lifecycle enforcement: transition SCHEDULED→LIVE and LIVE→ENDED
  await enforceLifecycleTransitions();

  const challenges = await prisma.challenge.findMany({
    where: {
      status: "LIVE",
    },
    include: {
      questions: {
        include: {
          question: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return challenges;
}

export async function getLatestChallenge() {
  // On-access lifecycle enforcement
  await enforceLifecycleTransitions();

  const challenge = await prisma.challenge.findFirst({
    where: {
      status: "LIVE",
    },
    include: {
      questions: {
        include: {
          question: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return challenge;
}

export async function getChallengeBySlug(slug: string) {
  const challenge = await prisma.challenge.findUnique({
    where: {
      slug,
    },
    include: {
      questions: {
        include: {
          question: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return challenge;
}

/**
 * Get challenge data prepared for an attempt.
 * Does NOT include correct answers — only question text and options.
 * Questions and options are shuffled server-side per attempt.
 */
async function getChallengeForAttempt(
  slug: string,
  attemptId: string
): Promise<ChallengeWithQuestionsForAttempt | null> {
  const challenge = await prisma.challenge.findUnique({
    where: {
      slug,
      status: "LIVE",
    },
    include: {
      questions: {
        include: {
          question: {
            include: {
              options: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!challenge) return null;

  // Check for existing randomization order on the attempt
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
  });

  let questionOrder: string[] | null = attempt?.questionOrder as string[] | null;
  let optionOrders: Record<string, string[]> | null = attempt?.optionOrders as Record<
    string,
    string[]
  > | null;

  const seed = `${attemptId}-${challenge.id}`;

  // Generate and persist randomization if not already set
  if (!questionOrder || !optionOrders) {
    const questionIds = challenge.questions.map((cq) => cq.questionId);
    questionOrder = seededShuffle(questionIds, seed);

    optionOrders = {};
    for (const cq of challenge.questions) {
      const optionIds = cq.question.options.map((opt) => opt.id);
      optionOrders[cq.questionId] = seededShuffle(optionIds, `${seed}-${cq.questionId}`);
    }

    // Persist randomization for refresh recovery
    await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        questionOrder: questionOrder,
        optionOrders: optionOrders,
      },
    });
  }

  // Build the question map for lookup
  const questionMap = new Map(challenge.questions.map((cq) => [cq.questionId, cq]));
  const labels = ["A", "B", "C", "D"];

  // Build sanitized response in shuffled order
  const sanitizedQuestions = questionOrder
    .map((questionId, index) => {
      const cq = questionMap.get(questionId);
      if (!cq) return null;

      // Build option map for this question
      const optionMap = new Map(cq.question.options.map((opt) => [opt.id, opt]));
      const shuffledOptionIds = optionOrders![questionId] || cq.question.options.map((o) => o.id);

      const shuffledOptions: ShuffledOption[] = shuffledOptionIds
        .map((optionId, optIdx) => {
          const opt = optionMap.get(optionId);
          if (!opt) return null;
          return {
            id: opt.id,
            text: opt.optionText,
            displayLabel: labels[optIdx] || String(optIdx),
          };
        })
        .filter(Boolean) as ShuffledOption[];

      return {
        id: cq.id,
        questionId: cq.questionId,
        question: cq.question.question,
        options: shuffledOptions,
        order: index,
      };
    })
    .filter(Boolean);

  return {
    ...challenge,
    questions: sanitizedQuestions,
  } as ChallengeWithQuestionsForAttempt;
}

// ─── Attempt Lifecycle ───────────────────────────────────────────

/**
 * Start or resume a challenge attempt.
 * - If no attempt exists, creates one with IN_PROGRESS status.
 * - If an IN_PROGRESS attempt exists, resumes it (with timer recalculation).
 * - If an EVALUATED/SUBMITTED attempt exists, returns error.
 * - Server-side timer enforcement: if timer expired, auto-submits.
 */
export async function startChallenge(slug: string): Promise<ChallengeStartResult> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  // Enforce lifecycle transitions before checking challenge
  await enforceLifecycleTransitions();

  // First, get the challenge to check it's LIVE
  const challengeCheck = await prisma.challenge.findUnique({
    where: { slug, status: "LIVE" },
    select: { id: true, durationInMinutes: true },
  });

  if (!challengeCheck) {
    return { success: false, error: "Challenge not found or not currently live" };
  }

  // Check for existing attempt (unique constraint: userId + challengeId)
  const existingAttempt = await prisma.attempt.findUnique({
    where: {
      userId_challengeId: {
        userId: session.user.id,
        challengeId: challengeCheck.id,
      },
    },
  });

  if (existingAttempt) {
    // Already submitted/evaluated — cannot retry
    if (
      existingAttempt.status === "SUBMITTED" ||
      existingAttempt.status === "EVALUATED" ||
      existingAttempt.status === "ABANDONED"
    ) {
      return {
        success: false,
        error: "You have already completed this challenge",
        existingAttempt,
      };
    }

    // IN_PROGRESS — check timer
    if (isTimerExpired(existingAttempt.startedAt, challengeCheck.durationInMinutes)) {
      // Timer expired while user was away — auto-submit
      const submitResult = await autoSubmitAttempt(existingAttempt.id);
      if (submitResult.success && submitResult.attempt) {
        return {
          success: false,
          error: "Time expired — your attempt has been auto-submitted",
          existingAttempt: submitResult.attempt,
        };
      }
    }

    // Resume existing attempt
    const challenge = await getChallengeForAttempt(slug, existingAttempt.id);
    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }

    return {
      success: true,
      attemptId: existingAttempt.id,
      challenge,
      existingAttempt,
    };
  }

  // Create new attempt
  const attempt = await prisma.attempt.create({
    data: {
      userId: session.user.id,
      challengeId: challengeCheck.id,
      status: "IN_PROGRESS",
    },
  });

  // Get challenge with shuffled questions for this new attempt
  const challenge = await getChallengeForAttempt(slug, attempt.id);
  if (!challenge) {
    return { success: false, error: "Challenge not found" };
  }

  return {
    success: true,
    attemptId: attempt.id,
    challenge,
  };
}

// ─── Answer Persistence ──────────────────────────────────────────

/**
 * Save a single answer with server-side timer enforcement.
 * Rejects saves if:
 * - Attempt not found or not IN_PROGRESS
 * - Timer has expired (triggers auto-submit)
 */
export async function saveAnswer(
  attemptId: string,
  questionId: string,
  selectedOptionId: string | null
) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const attempt = await prisma.attempt.findFirst({
    where: {
      id: attemptId,
      userId: session.user.id,
      status: "IN_PROGRESS",
    },
    include: {
      challenge: { select: { durationInMinutes: true } },
    },
  });

  if (!attempt) {
    return { success: false, error: "Attempt not found or already submitted" };
  }

  // SERVER-SIDE TIMER ENFORCEMENT
  if (isTimerExpired(attempt.startedAt, attempt.challenge.durationInMinutes)) {
    await autoSubmitAttempt(attemptId);
    return { success: false, error: "Time expired — attempt auto-submitted" };
  }

  // Resolve the option text for denormalization
  let selectedOptionText: string | null = null;
  if (selectedOptionId) {
    const option = await prisma.questionOption.findUnique({
      where: { id: selectedOptionId },
      select: { optionText: true, isCorrect: true },
    });
    if (option) {
      selectedOptionText = option.optionText;
    }
  }

  // Determine correctness
  const correctOption = await prisma.questionOption.findFirst({
    where: { questionId, isCorrect: true },
  });

  const isCorrect =
    selectedOptionId && correctOption ? selectedOptionId === correctOption.id : null;

  const answer = await prisma.attemptAnswer.upsert({
    where: {
      attemptId_questionId: {
        attemptId,
        questionId,
      },
    },
    update: {
      selectedOptionId,
      selectedOption: selectedOptionText,
      isCorrect,
      isSkipped: !selectedOptionId,
      answeredAt: new Date(),
    },
    create: {
      attemptId,
      questionId,
      selectedOptionId,
      selectedOption: selectedOptionText,
      isCorrect,
      isSkipped: !selectedOptionId,
    },
  });

  return { success: true, answer };
}

/**
 * Save multiple answers in batch (for network recovery / queue flush).
 * Same server-side timer enforcement as saveAnswer.
 */
export async function saveMultipleAnswers(attemptId: string, answers: QuizAnswerState) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const attempt = await prisma.attempt.findFirst({
    where: {
      id: attemptId,
      userId: session.user.id,
      status: "IN_PROGRESS",
    },
    include: {
      challenge: { select: { durationInMinutes: true } },
    },
  });

  if (!attempt) {
    return { success: false, error: "Attempt not found or already submitted" };
  }

  // SERVER-SIDE TIMER ENFORCEMENT
  if (isTimerExpired(attempt.startedAt, attempt.challenge.durationInMinutes)) {
    await autoSubmitAttempt(attemptId);
    return { success: false, error: "Time expired — attempt auto-submitted" };
  }

  // Batch resolve correct options
  const questionIds = Object.keys(answers);
  const correctOptions = await prisma.questionOption.findMany({
    where: {
      questionId: { in: questionIds },
      isCorrect: true,
    },
  });
  const correctOptionMap = new Map(correctOptions.map((opt) => [opt.questionId, opt]));

  // Resolve all selected options for text denormalization
  const selectedOptionIds = Object.values(answers).filter(Boolean) as string[];
  const selectedOptions = await prisma.questionOption.findMany({
    where: { id: { in: selectedOptionIds } },
  });
  const selectedOptionMap = new Map(selectedOptions.map((opt) => [opt.id, opt]));

  for (const [questionId, selectedOptionId] of Object.entries(answers)) {
    const correctOpt = correctOptionMap.get(questionId);
    const selectedOpt = selectedOptionId ? selectedOptionMap.get(selectedOptionId) : null;

    await prisma.attemptAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
      update: {
        selectedOptionId,
        selectedOption: selectedOpt?.optionText || null,
        isCorrect: selectedOptionId && correctOpt ? selectedOptionId === correctOpt.id : null,
        isSkipped: !selectedOptionId,
        answeredAt: new Date(),
      },
      create: {
        attemptId,
        questionId,
        selectedOptionId,
        selectedOption: selectedOpt?.optionText || null,
        isCorrect: selectedOptionId && correctOpt ? selectedOptionId === correctOpt.id : null,
        isSkipped: !selectedOptionId,
      },
    });
  }

  return { success: true };
}

// ─── Challenge Submission & Evaluation ───────────────────────────

/**
 * Submit a challenge attempt — triggers instant server-side evaluation.
 * This is the ONLY path to finalize an attempt (user submit, auto-submit, or challenge end).
 */
export async function submitChallenge(attemptId: string): Promise<ChallengeSubmitResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  return evaluateAndFinalizeAttempt(attemptId, session.user.id, false);
}

/**
 * Internal auto-submit — called when timer expires or challenge ends.
 * Bypasses user auth check (system-initiated).
 */
async function autoSubmitAttempt(attemptId: string): Promise<ChallengeSubmitResult> {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    select: { userId: true, status: true },
  });

  if (!attempt || attempt.status !== "IN_PROGRESS") {
    return { success: false, error: "Attempt not found or already submitted" };
  }

  return evaluateAndFinalizeAttempt(attemptId, attempt.userId, true);
}

/**
 * Core evaluation logic — server-authoritative scoring.
 * Runs in a single transaction for atomicity.
 */
async function evaluateAndFinalizeAttempt(
  attemptId: string,
  userId: string,
  isAutoSubmitted: boolean
): Promise<ChallengeSubmitResult> {
  const attempt = await prisma.attempt.findFirst({
    where: {
      id: attemptId,
      userId: userId,
      status: "IN_PROGRESS",
    },
    include: {
      challenge: {
        include: {
          questions: {
            include: {
              question: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      },
      answers: true,
    },
  });

  if (!attempt) {
    return { success: false, error: "Attempt not found or already submitted" };
  }

  // ─── Server-Authoritative Evaluation ───────────────────────
  const allQuestionIds = attempt.challenge.questions.map((cq) => cq.questionId);
  const answeredQuestionIds = attempt.answers.map((a: { questionId: string }) => a.questionId);
  const unansweredCount = allQuestionIds.filter(
    (id: string) => !answeredQuestionIds.includes(id)
  ).length;

  // Re-evaluate correctness server-side (don't trust saved isCorrect)
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let totalScore = 0;

  for (const cq of attempt.challenge.questions) {
    const attemptAnswer = attempt.answers.find(
      (a: { questionId: string }) => a.questionId === cq.questionId
    );

    if (!attemptAnswer || !attemptAnswer.selectedOptionId) {
      // Unanswered — 0 points
      continue;
    }

    const correctOption = cq.question.options.find((opt) => opt.isCorrect);
    if (correctOption && attemptAnswer.selectedOptionId === correctOption.id) {
      correctAnswers++;
      totalScore += cq.question.marks;
    } else {
      wrongAnswers++;
    }
  }

  // ─── Finalize attempt in a single transaction ──────────────
  const submittedAt = new Date();
  const timeTakenInSeconds = Math.floor(
    (submittedAt.getTime() - attempt.startedAt.getTime()) / 1000
  );

  const updatedAttempt = await prisma.attempt.update({
    where: { id: attemptId },
    data: {
      status: "EVALUATED",
      score: totalScore,
      correctAnswers,
      totalAnswered: answeredQuestionIds.length,
      submittedAt,
      timeTakenInSeconds,
      isAutoSubmitted,
    },
    include: {
      challenge: true,
      answers: true,
    },
  });

  // ─── Update analytics (non-blocking) ──────────────────────
  updateAnalyticsOnEvaluation(attempt.challengeId, attempt.challenge.questions, attempt.answers, {
    score: totalScore,
    correctAnswers,
    wrongAnswers,
    timeTakenInSeconds,
  }).catch(console.error);

  return {
    success: true,
    attempt: updatedAttempt as AttemptWithDetails,
  };
}

// ─── Analytics Updates ───────────────────────────────────────────

async function updateAnalyticsOnEvaluation(
  challengeId: string,
  questions: { questionId: string }[],

  answers: any[],
  scores: {
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    timeTakenInSeconds: number;
  }
) {
  // Update ChallengeAnalytics
  await prisma.challengeAnalytics.upsert({
    where: { challengeId },
    update: {
      totalAttempts: { increment: 1 },
      completedAttempts: { increment: 1 },
      totalScore: { increment: scores.score },
    },
    create: {
      challengeId,
      totalAttempts: 1,
      completedAttempts: 1,
      totalScore: scores.score,
      averageScore: scores.score,
      highestScore: scores.score,
      lowestScore: scores.score,
      averageTimeSpent: scores.timeTakenInSeconds,
      averageAccuracy: questions.length > 0 ? (scores.correctAnswers / questions.length) * 100 : 0,
      completionRate: 100,
    },
  });

  // Update QuestionAnalytics for each question
  for (const cq of questions) {
    const answer = answers.find((a: { questionId: string }) => a.questionId === cq.questionId);
    await prisma.questionAnalytics.upsert({
      where: { questionId: cq.questionId },
      update: {
        totalAttempts: { increment: 1 },
        correctAttempts: { increment: answer?.isCorrect === true ? 1 : 0 },
        wrongAttempts: { increment: answer?.isCorrect === false ? 1 : 0 },
        skippedAttempts: { increment: !answer || answer.isSkipped ? 1 : 0 },
      },
      create: {
        questionId: cq.questionId,
        totalAttempts: 1,
        correctAttempts: answer?.isCorrect === true ? 1 : 0,
        wrongAttempts: answer?.isCorrect === false ? 1 : 0,
        skippedAttempts: !answer || answer.isSkipped ? 1 : 0,
      },
    });
  }
}

// ─── Challenge Lifecycle Enforcement ─────────────────────────────

/**
 * On-access lifecycle transition enforcement.
 * Checks if any challenges need to transition SCHEDULED→LIVE or LIVE→ENDED.
 * Called on challenge list/access queries.
 */
async function enforceLifecycleTransitions() {
  const now = new Date();

  // SCHEDULED → LIVE: startsAt has passed
  const scheduledToLive = await prisma.challenge.findMany({
    where: {
      status: "SCHEDULED",
      startsAt: { lte: now },
    },
  });

  for (const challenge of scheduledToLive) {
    await prisma.challenge.update({
      where: { id: challenge.id },
      data: {
        status: "LIVE",
        createdAt: now,
      },
    });
  }

  // LIVE → ENDED: endsAt has passed
  const liveToEnded = await prisma.challenge.findMany({
    where: {
      status: "LIVE",
      endsAt: { lte: now },
    },
  });

  for (const challenge of liveToEnded) {
    await endChallenge(challenge.id);
  }
}

/**
 * End a challenge: transition LIVE→ENDED, auto-submit all active attempts,
 * and compute the leaderboard.
 */
async function endChallenge(challengeId: string) {
  const now = new Date();

  // Auto-submit all IN_PROGRESS attempts
  const activeAttempts = await prisma.attempt.findMany({
    where: {
      challengeId,
      status: "IN_PROGRESS",
    },
  });

  for (const attempt of activeAttempts) {
    await autoSubmitAttempt(attempt.id);
  }

  // Transition challenge to ENDED
  await prisma.challenge.update({
    where: { id: challengeId },
    data: {
      status: "ENDED",
      endsAt: now,
    },
  });

  // Compute and freeze leaderboard
  await computeLeaderboard(challengeId);
}

/**
 * Compute the leaderboard for a challenge.
 * Ranks all EVALUATED attempts by: score DESC, accuracy DESC, time ASC, submittedAt ASC.
 */
async function computeLeaderboard(challengeId: string) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { totalQuestions: true },
  });

  if (!challenge) return;

  const attempts = await prisma.attempt.findMany({
    where: {
      challengeId,
      status: "EVALUATED",
    },
    orderBy: [
      { score: "desc" },
      { correctAnswers: "desc" },
      { timeTakenInSeconds: "asc" },
      { submittedAt: "asc" },
    ],
  });

  // Delete any existing leaderboard entries (idempotent recomputation)
  await prisma.leaderboardEntry.deleteMany({
    where: { challengeId },
  });

  // Create ranked entries
  const entries = attempts.map((attempt, index) => ({
    challengeId,
    userId: attempt.userId,
    attemptId: attempt.id,
    rank: index + 1,
    score: attempt.score,
    accuracy:
      challenge.totalQuestions > 0 ? (attempt.correctAnswers / challenge.totalQuestions) * 100 : 0,
    timeTakenInSeconds: attempt.timeTakenInSeconds || 0,
  }));

  if (entries.length > 0) {
    await prisma.leaderboardEntry.createMany({
      data: entries,
    });
  }
}

// ─── Query Functions ─────────────────────────────────────────────

export async function getAttemptById(attemptId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const attempt = await prisma.attempt.findFirst({
    where: {
      id: attemptId,
      userId: session.user.id,
      status: { in: ["SUBMITTED", "EVALUATED", "ABANDONED"] },
    },
    include: {
      challenge: {
        include: {
          questions: {
            include: {
              question: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      },
      answers: true,
    },
  });

  return attempt;
}

export async function getUserAttempts(userId: string) {
  const attempts = await prisma.attempt.findMany({
    where: {
      userId,
      status: { in: ["EVALUATED", "ABANDONED"] },
    },
    include: {
      challenge: true,
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  return attempts;
}

export async function getUserLatestAttempt(userId: string) {
  const attempt = await prisma.attempt.findFirst({
    where: {
      userId,
      status: { in: ["EVALUATED", "ABANDONED"] },
    },
    include: {
      challenge: true,
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  return attempt;
}

export async function hasUserAttemptedChallenge(userId: string, challengeId: string) {
  const attempt = await prisma.attempt.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId,
      },
    },
  });

  return !!attempt;
}

export async function getAttemptAnswers(attemptId: string): Promise<QuizAnswerState> {
  const session = await auth();

  if (!session?.user?.id) {
    return {};
  }

  const attempt = await prisma.attempt.findFirst({
    where: {
      id: attemptId,
      userId: session.user.id,
      status: "IN_PROGRESS",
    },
  });

  if (!attempt) {
    return {};
  }

  const answers = await prisma.attemptAnswer.findMany({
    where: { attemptId },
  });

  const answerState: QuizAnswerState = {};
  for (const answer of answers) {
    if (answer.selectedOptionId) {
      answerState[answer.questionId] = answer.selectedOptionId;
    }
  }

  return answerState;
}

/**
 * Get remaining time for an active attempt.
 * Returns server-authoritative remaining seconds.
 */
export async function getAttemptRemainingTime(
  attemptId: string
): Promise<{ remainingSeconds: number; isExpired: boolean } | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const attempt = await prisma.attempt.findFirst({
    where: {
      id: attemptId,
      userId: session.user.id,
      status: "IN_PROGRESS",
    },
    include: {
      challenge: { select: { durationInMinutes: true } },
    },
  });

  if (!attempt) return null;

  const remaining = getRemainingSeconds(attempt.startedAt, attempt.challenge.durationInMinutes);
  return {
    remainingSeconds: remaining,
    isExpired: remaining <= 0,
  };
}
