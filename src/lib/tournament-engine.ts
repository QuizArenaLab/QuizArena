// @ts-nocheck
import { Attempt, AttemptAnswer, Question, QuestionOption } from "../generated/prisma";

export interface EvaluatedAttempt {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredCount: number;
  totalAnswered: number;
  accuracy: number;
}

/**
 * Validates and evaluates a single tournament challenge attempt.
 * Enforces positive marking only.
 */
export function evaluateTournamentAttempt(
  attempt: Attempt & { answers: AttemptAnswer[] },
  questions: (Question & { options: QuestionOption[] })[]
): EvaluatedAttempt {
  let score = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let unansweredCount = 0;

  const questionMap = new Map<string, Question & { options: QuestionOption[] }>();
  for (const q of questions) {
    questionMap.set(q.id, q);
  }

  for (const answer of attempt.answers) {
    const question = questionMap.get(answer.questionId);
    if (!question) continue;

    if (answer.isSkipped || !answer.selectedOptionId) {
      unansweredCount++;
      continue;
    }

    const selectedOption = question.options.find((o) => o.id === answer.selectedOptionId);
    if (!selectedOption) {
      wrongAnswers++;
      continue;
    }

    if (selectedOption.isCorrect) {
      correctAnswers++;
      score += question.marks;
    } else {
      wrongAnswers++;
      // No negative marking as per phase 8.7 locked rules
    }
  }

  const totalAnswered = correctAnswers + wrongAnswers;
  const accuracy = totalAnswered > 0 ? (correctAnswers / totalAnswered) * 100 : 0;

  return {
    score,
    correctAnswers,
    wrongAnswers,
    unansweredCount,
    totalAnswered,
    accuracy,
  };
}

/**
 * Calculates aggregated statistics for a tournament leaderboard entry.
 */
export function calculateAggregateTournamentStats(attempts: EvaluatedAttempt[]): {
  totalScore: number;
  averageAccuracy: number;
  totalChallengesCompleted: number;
} {
  const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
  const totalChallengesCompleted = attempts.length;

  let totalAccuracySum = 0;
  attempts.forEach((a) => (totalAccuracySum += a.accuracy));
  const averageAccuracy =
    totalChallengesCompleted > 0 ? totalAccuracySum / totalChallengesCompleted : 0;

  return {
    totalScore,
    averageAccuracy,
    totalChallengesCompleted,
  };
}
