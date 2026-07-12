// @ts-nocheck
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  builderAddQuestionSchema,
  builderRemoveQuestionSchema,
  builderReorderQuestionsSchema,
} from "@/lib/validations/challenge";
import { auth } from "@/auth";

export async function createChallengeDraft(data: { title: string; category?: any }) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    const challenge = await prisma.challenge.create({
      data: {
        title: data.title,
        slug,
        status: "DRAFT",
        category: data.category || "SSC",
        durationInMinutes: 30, // Default
        createdById: session.user.id,
      },
    });

    revalidatePath("/dashboard/admin/challenges");
    return { success: true, challengeId: challenge.id };
  } catch (error: any) {
    console.error("Failed to create challenge draft:", error);
    return { success: false, error: error.message || "Failed to create draft" };
  }
}

export async function getChallengeComposition(challengeId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
        include: {
          question: true,
        },
      },
    },
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  return challenge;
}

export async function addQuestionToChallenge(payload: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const result = builderAddQuestionSchema.safeParse(payload);
  if (!result.success) {
    return { success: false, error: "Invalid payload" };
  }

  const { challengeId, questionId } = result.data;

  try {
    // 1. Verify question is APPROVED
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question || question.status !== "APPROVED") {
      return { success: false, error: "Only APPROVED questions can be added." };
    }

    // 2. Prevent Duplicate
    const existing = await prisma.challengeQuestion.findUnique({
      where: {
        challengeId_questionId: {
          challengeId,
          questionId,
        },
      },
    });

    if (existing) {
      return { success: false, error: "Question is already in this challenge." };
    }

    // 3. Get max order
    const maxOrderRes = await prisma.challengeQuestion.aggregate({
      where: { challengeId },
      _max: { orderIndex: true },
    });
    const nextOrder = (maxOrderRes._max.orderIndex ?? -1) + 1;

    // 4. Add Question
    await prisma.challengeQuestion.create({
      data: {
        challengeId,
        questionId,
        orderIndex: nextOrder,
        marks: question.marks || 1,
      },
    });

    // 5. Update Challenge totalQuestions
    await prisma.challenge.update({
      where: { id: challengeId },
      data: { totalQuestions: { increment: 1 } },
    });

    // Update usage count for future analytics
    await prisma.question.update({
      where: { id: questionId },
      data: { usageCount: { increment: 1 } },
    });

    revalidatePath(`/dashboard/admin/challenges/builder/${challengeId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add question:", error);
    return { success: false, error: "Server error" };
  }
}

export async function removeQuestionFromChallenge(payload: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const result = builderRemoveQuestionSchema.safeParse(payload);
  if (!result.success) {
    return { success: false, error: "Invalid payload" };
  }

  const { challengeId, questionId } = result.data;

  try {
    await prisma.challengeQuestion.delete({
      where: {
        challengeId_questionId: {
          challengeId,
          questionId,
        },
      },
    });

    await prisma.challenge.update({
      where: { id: challengeId },
      data: { totalQuestions: { decrement: 1 } },
    });

    // Decrement usage count
    await prisma.question.update({
      where: { id: questionId },
      data: { usageCount: { decrement: 1 } },
    });

    revalidatePath(`/dashboard/admin/challenges/builder/${challengeId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to remove question:", error);
    return { success: false, error: "Server error" };
  }
}

export async function reorderChallengeQuestions(payload: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const result = builderReorderQuestionsSchema.safeParse(payload);
  if (!result.success) {
    return { success: false, error: "Invalid payload" };
  }

  const { challengeId, questionIds } = result.data;

  try {
    // We use a transaction to safely update all order indices
    await prisma.$transaction(
      questionIds.map((qId, index) =>
        prisma.challengeQuestion.update({
          where: {
            challengeId_questionId: {
              challengeId,
              questionId: qId,
            },
          },
          data: {
            orderIndex: index,
          },
        })
      )
    );

    revalidatePath(`/dashboard/admin/challenges/builder/${challengeId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to reorder questions:", error);
    return { success: false, error: "Server error" };
  }
}

export async function saveChallengeDraft(challengeId: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Validate minimum requirements for the challenge
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: { questions: true },
    });

    if (!challenge) {
      return { success: false, error: "Challenge not found" };
    }

    if (challenge.questions.length === 0) {
      return { success: false, error: "Challenge must have at least one question." };
    }

    // Set to scheduled or draft, etc. For now we just return success
    // to confirm it's valid. The actual status transition is separate.
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save draft:", error);
    return { success: false, error: "Server error" };
  }
}

export async function searchApprovedQuestions({
  search,
  category,
  difficulty,
  subject,
  page = 1,
  limit = 10,
}: {
  search?: string;
  category?: string;
  difficulty?: string;
  subject?: string;
  page?: number;
  limit?: number;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const where: any = {
    status: "APPROVED",
  };

  if (search) {
    where.OR = [
      { questionCode: { contains: search, mode: "insensitive" } },
      { question: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }

  if (category) where.category = category;
  if (difficulty) where.difficulty = difficulty;
  if (subject) where.subject = subject;

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.question.count({ where }),
  ]);

  return { questions, total };
}
