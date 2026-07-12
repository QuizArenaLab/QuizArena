// @ts-nocheck
"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export type QuestionHealthStatus =
  | "HEALTHY"
  | "REVIEW_REQUIRED"
  | "HIGH_RISK"
  | "OVERUSED"
  | "FLAGGED";

export async function calculateQuestionAnalytics(questionId: string) {
  try {
    const analytics = await prisma.questionAnalytics.findUnique({
      where: { questionId },
    });

    if (!analytics) return null;

    const total = analytics.totalAttempts;
    let accuracyRate = 0;

    if (total > 0) {
      accuracyRate = (analytics.correctAttempts / total) * 100;
    }

    return await prisma.questionAnalytics.update({
      where: { questionId },
      data: { accuracyRate },
    });
  } catch (error) {
    console.error("[ANALYTICS_CALCULATION_ERROR]", error);
    throw new Error("Failed to calculate question analytics");
  }
}

export async function detectWeakQuestions() {
  try {
    const weakQuestions = await prisma.questionAnalytics.findMany({
      where: {
        OR: [
          { accuracyRate: { lt: 20 }, totalAttempts: { gte: 10 } }, // Abnormally low accuracy
          { accuracyRate: { gt: 95 }, totalAttempts: { gte: 10 } }, // Abnormally high accuracy
          { flaggedCount: { gte: 3 } }, // Flagged frequently
        ],
      },
      include: {
        question: {
          select: {
            id: true,
            questionCode: true,
            difficulty: true,
            status: true,
            category: true,
          },
        },
      },
      orderBy: { accuracyRate: "asc" },
      take: 50,
    });
    return weakQuestions;
  } catch (error) {
    console.error("[DETECT_WEAK_QUESTIONS_ERROR]", error);
    throw new Error("Failed to detect weak questions");
  }
}

export async function getQuestionPerformance(questionId: string) {
  try {
    return await prisma.questionAnalytics.findUnique({
      where: { questionId },
      include: {
        question: true,
      },
    });
  } catch (error) {
    console.error("[GET_QUESTION_PERFORMANCE_ERROR]", error);
    throw new Error("Failed to get question performance");
  }
}

export async function classifyQuestionHealth(questionId: string): Promise<QuestionHealthStatus> {
  try {
    const analytics = await prisma.questionAnalytics.findUnique({
      where: { questionId },
    });

    if (!analytics) return "REVIEW_REQUIRED";

    if (analytics.flaggedCount >= 3) return "FLAGGED";
    if (analytics.usageCount > 500) return "OVERUSED"; // Example threshold

    // Require at least 10 attempts for meaningful accuracy classification
    if (analytics.totalAttempts >= 10) {
      if (analytics.accuracyRate < 20 || analytics.accuracyRate > 95) {
        return "HIGH_RISK";
      }
      if (analytics.accuracyRate < 40) {
        return "REVIEW_REQUIRED";
      }
    }

    return "HEALTHY";
  } catch (error) {
    console.error("[CLASSIFY_QUESTION_HEALTH_ERROR]", error);
    throw new Error("Failed to classify question health");
  }
}

export async function getDifficultyInsights() {
  try {
    // Find questions where assigned difficulty doesn't match performance
    // BEGINNER should have high accuracy, HARDCORE should have low accuracy
    const mismatches = await prisma.questionAnalytics.findMany({
      where: {
        totalAttempts: { gte: 10 },
        OR: [
          { question: { difficulty: "BEGINNER" }, accuracyRate: { lt: 50 } }, // Performing like hard
          { question: { difficulty: "HARDCORE" }, accuracyRate: { gt: 70 } }, // Performing like easy
        ],
      },
      include: {
        question: {
          select: {
            id: true,
            questionCode: true,
            difficulty: true,
            status: true,
          },
        },
      },
      take: 50,
    });

    return mismatches;
  } catch (error) {
    console.error("[GET_DIFFICULTY_INSIGHTS_ERROR]", error);
    throw new Error("Failed to get difficulty insights");
  }
}

export async function getQuestionUsageAnalytics() {
  try {
    const overused = await prisma.questionAnalytics.findMany({
      where: {
        usageCount: { gt: 100 }, // Arbitrary threshold for overused
      },
      orderBy: { usageCount: "desc" },
      take: 50,
      include: {
        question: {
          select: {
            id: true,
            questionCode: true,
            difficulty: true,
            category: true,
          },
        },
      },
    });

    return overused;
  } catch (error) {
    console.error("[GET_QUESTION_USAGE_ANALYTICS_ERROR]", error);
    throw new Error("Failed to get usage analytics");
  }
}

export const getCategoryPerformance = unstable_cache(
  async () => {
    try {
      const results = await prisma.$queryRaw<
        { category: string; questionCount: bigint; totalAccuracy: number; totalAttempts: bigint }[]
      >`
        SELECT 
          q.category, 
          COUNT(qa."questionId") as "questionCount", 
          SUM(qa."accuracyRate") as "totalAccuracy", 
          SUM(qa."totalAttempts") as "totalAttempts"
        FROM question_analytics qa
        JOIN questions q ON qa."questionId" = q.id
        WHERE q.category IS NOT NULL
        GROUP BY q.category
      `;

      return results
        .map((r) => ({
          category: r.category,
          questionCount: Number(r.questionCount),
          averageAccuracy:
            Number(r.questionCount) > 0 ? r.totalAccuracy / Number(r.questionCount) : 0,
          totalAttempts: Number(r.totalAttempts),
        }))
        .sort((a, b) => b.averageAccuracy - a.averageAccuracy);
    } catch (error) {
      console.error("[GET_CATEGORY_PERFORMANCE_ERROR]", error);
      throw new Error("Failed to get category performance");
    }
  },
  ["question-category-performance"],
  { revalidate: 3600 } // Cache for 1 hour
);
