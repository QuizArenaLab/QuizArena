// @ts-nocheck
"use server";

import { prisma } from "@/lib/prisma";
import { ChallengeDifficulty, QuestionStatus, ExamCategory } from "@/generated/prisma";
import { z } from "zod";

export const questionSearchSchema = z.object({
  query: z.string().optional(),
  exam: z.nativeEnum(ExamCategory).optional(),
  subject: z.string().optional(),
  topic: z.string().optional(),
  difficulty: z.nativeEnum(ChallengeDifficulty).optional(),
  status: z.nativeEnum(QuestionStatus).default("APPROVED"),
  cursor: z.string().optional(), // For cursor-based pagination
  limit: z.number().min(1).max(100).default(20),
});

export type QuestionSearchParams = z.infer<typeof questionSearchSchema>;

export async function searchQuestionBank(params: QuestionSearchParams) {
  try {
    const validated = questionSearchSchema.parse(params);

    const where: any = {
      status: validated.status,
      isActive: true, // Only fetch active questions
    };

    if (validated.query) {
      where.OR = [
        { questionCode: { contains: validated.query, mode: "insensitive" } },
        { question: { contains: validated.query, mode: "insensitive" } },
        { tags: { has: validated.query } },
      ];
    }

    if (validated.exam) where.examCategory = validated.exam;
    if (validated.subject) where.subject = { equals: validated.subject, mode: "insensitive" };
    if (validated.topic) where.topic = { equals: validated.topic, mode: "insensitive" };
    if (validated.difficulty) where.difficulty = validated.difficulty;

    const items = await prisma.question.findMany({
      where,
      take: validated.limit + 1, // Take one extra to determine if there's a next page
      cursor: validated.cursor ? { id: validated.cursor } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        questionCode: true,
        question: true,
        explanation: true,
        difficulty: true,
        healthScore: true,
        usageCount: true,
        topic: true,
        subject: true,
        marks: true,
        negativeMarks: true,
        options: {
          orderBy: { order: "asc" },
          select: { id: true, optionText: true, isCorrect: true },
        },
      },
    });

    let nextCursor: string | undefined = undefined;
    if (items.length > validated.limit) {
      const nextItem = items.pop(); // Remove the extra item
      nextCursor = nextItem?.id;
    }

    return {
      success: true,
      data: items,
      nextCursor,
    };
  } catch (error) {
    console.error("[searchQuestionBank]", error);
    return { success: false, error: "Failed to fetch question bank" };
  }
}
