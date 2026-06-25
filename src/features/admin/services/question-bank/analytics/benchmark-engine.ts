/**
 * QuizArena — Benchmark Engine
 *
 * Single responsibility: normalized peer comparison.
 * Compares a question's performance against peers within the
 * same exam, subject, topic, and difficulty — never globally.
 *
 * All queries read from QuestionUsageStats (precomputed aggregates).
 * Never joins QuestionAttemptLog.
 */

import { prisma } from "@/lib/prisma";
import { MIN_ATTEMPTS, type BenchmarkPerformance } from "./constants";

export interface BenchmarkResult {
  questionSuccessRate: number;
  peerAverage: number;
  peerCount: number;
  performance: BenchmarkPerformance;
  scope: string;
}

export interface QuestionBenchmarks {
  byTopic: BenchmarkResult | null;
  bySubject: BenchmarkResult | null;
  byExam: BenchmarkResult | null;
  insufficientData: boolean;
}

function classifyPerformance(
  questionRate: number,
  peerAverage: number
): BenchmarkPerformance {
  const delta = questionRate - peerAverage;
  if (delta > 0.05) return "ABOVE_AVERAGE";
  if (delta < -0.05) return "BELOW_AVERAGE";
  return "AVERAGE";
}

async function computePeerBenchmark(
  questionSuccessRate: number,
  where: Record<string, unknown>,
  questionId: string,
  scope: string
): Promise<BenchmarkResult | null> {
  const peers = await prisma.questionUsageStats.findMany({
    where: {
      timesAttempted: { gte: MIN_ATTEMPTS },
      question: where,
      questionId: { not: questionId },
    },
    select: { successRate: true },
  });

  if (peers.length === 0) return null;

  const totalRate = peers.reduce((sum, p) => sum + p.successRate, 0);
  const peerAverage = totalRate / peers.length;

  return {
    questionSuccessRate,
    peerAverage,
    peerCount: peers.length,
    performance: classifyPerformance(questionSuccessRate, peerAverage),
    scope,
  };
}

/**
 * Get benchmarks for a question against normalized peer groups.
 * Compares within: same topic, same subject, same exam category.
 */
export async function getQuestionBenchmark(
  questionId: string
): Promise<QuestionBenchmarks> {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { usageStats: true },
  });

  if (!question) throw new Error("Question not found");

  const stats = question.usageStats;
  if (!stats || stats.timesAttempted < MIN_ATTEMPTS) {
    return { byTopic: null, bySubject: null, byExam: null, insufficientData: true };
  }

  const successRate = stats.successRate;
  const results = await Promise.all([
    // Topic-level benchmark
    question.topic
      ? computePeerBenchmark(
          successRate,
          { topic: question.topic, difficulty: question.difficulty },
          questionId,
          `Topic: ${question.topic}`
        )
      : null,
    // Subject-level benchmark
    question.subject
      ? computePeerBenchmark(
          successRate,
          { subject: question.subject, difficulty: question.difficulty },
          questionId,
          `Subject: ${question.subject}`
        )
      : null,
    // Exam-level benchmark
    question.examCategory
      ? computePeerBenchmark(
          successRate,
          { examCategory: question.examCategory },
          questionId,
          `Exam: ${question.examCategory}`
        )
      : null,
  ]);

  return {
    byTopic: results[0],
    bySubject: results[1],
    byExam: results[2],
    insufficientData: false,
  };
}
