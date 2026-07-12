// @ts-nocheck
"use server";

import { prisma } from "@/lib/prisma";
import { BuilderHydrationData, BuilderState } from "../types/builder.types";

export async function fetchBuilderHydrationData(
  competitionId: string
): Promise<{ success: boolean; data?: BuilderHydrationData; error?: string }> {
  try {
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        sections: {
          orderBy: { displayOrder: "asc" },
        },
        questions: {
          include: {
            question: true,
          },
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!competition) {
      return { success: false, error: "Competition not found" };
    }

    const sections = competition.sections.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      instructions: s.instructions,
      passingMarks: s.passingMarks,
      displayOrder: s.displayOrder,
    }));

    const questions = competition.questions.map((cq) => ({
      id: cq.id,
      questionId: cq.questionId,
      sectionId: cq.sectionId || "default",
      displayOrder: cq.displayOrder,
      config: {
        marks: cq.marks,
        negativeMarks: cq.negativeMarks,
        isBonus: cq.isBonus,
        isMandatory: cq.isMandatory,
        difficultyOverride: cq.difficultyOverride,
        timeLimitOverride: cq.timeLimitOverride,
      },
      original: {
        question: cq.question.question,
        topic: cq.question.topic,
        difficulty: cq.question.difficulty,
        healthScore: cq.question.healthScore,
        usageCount: cq.question.usageCount,
      },
    }));

    return {
      success: true,
      data: {
        metadata: {
          id: competition.id,
          title: competition.title,
          status: competition.status,
          competitionType: competition.competitionType,
          exam: competition.exam,
        },
        sections,
        questions,
      },
    };
  } catch (error) {
    console.error("[fetchBuilderHydrationData]", error);
    return { success: false, error: "Failed to load builder data" };
  }
}

export async function saveBuilderStateBatch(
  competitionId: string,
  payload: {
    sections: Record<string, any>;
    questions: Record<string, any>;
    sectionOrder: string[];
  }
) {
  // In a real app, this would use a massive Prisma transaction to sync the state:
  // 1. Delete removed sections and questions
  // 2. Upsert sections
  // 3. Upsert questions (with config overrides)
  // For now, we will simulate a successful save to enable optimistic UI
  try {
    // Simulating delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  } catch (error) {
    console.error("[saveBuilderStateBatch]", error);
    return { success: false, error: "Failed to save composition" };
  }
}
