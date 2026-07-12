import { z } from "zod";
import { QuestionType, QuestionDifficulty, QuestionLanguage } from "../enums";

export const CreateQuestionSchema = z.object({
  bankId: z.string().cuid("Invalid Question Bank ID"),
  organizationId: z.string().cuid().optional(),
  type: z.nativeEnum(QuestionType),
  difficulty: z.nativeEnum(QuestionDifficulty).default(QuestionDifficulty.MEDIUM),
  language: z.nativeEnum(QuestionLanguage).default(QuestionLanguage.EN),
  chapterId: z.string().cuid().optional(),

  // Content
  statement: z.string().min(5, "Statement is too short").max(5000, "Statement is too long"),
  explanation: z.string().max(10000).optional(),

  // Options (for MCQ/MSQ)
  options: z
    .array(
      z.object({
        content: z.string().min(1),
        isCorrect: z.boolean(),
        displayOrder: z.number().int(),
      })
    )
    .optional(),
});

export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;

export const UpdateQuestionDraftSchema = z.object({
  difficulty: z.nativeEnum(QuestionDifficulty).optional(),
  language: z.nativeEnum(QuestionLanguage).optional(),
  chapterId: z.string().cuid().nullable().optional(),

  statement: z.string().min(5).max(5000).optional(),
  explanation: z.string().max(10000).nullable().optional(),

  options: z
    .array(
      z.object({
        id: z.string().cuid().optional(),
        content: z.string().min(1),
        isCorrect: z.boolean(),
        displayOrder: z.number().int(),
      })
    )
    .optional(),
});

export type UpdateQuestionDraftInput = z.infer<typeof UpdateQuestionDraftSchema>;
