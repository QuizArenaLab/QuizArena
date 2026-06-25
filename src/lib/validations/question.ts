import { z } from "zod";

// ─── Enum Constants ─────────────────────────────────────────────────────────

export const QUESTION_DIFFICULTIES = ["BEGINNER", "MEDIUM", "HARDCORE"] as const;

export const QUESTION_STATUSES = [
  "DRAFT",
  "REVIEW",
  "APPROVED",
  "REJECTED",
  "ARCHIVED",
  "FLAGGED",
] as const;

export const COMMON_SUBJECTS = [
  "Quantitative Aptitude",
  "Reasoning Ability",
  "English Language",
  "General Awareness",
  "General Science",
  "Computer Knowledge",
  "Current Affairs",
] as const;

// ─── Option Schema ──────────────────────────────────────────────────────────

export const questionOptionSchema = z.object({
  id: z.string().cuid().optional(),
  optionText: z.string().min(1, "Option text is required").max(500, "Option too long"),
  isCorrect: z.boolean(),
  order: z.number().int(),
});

// ─── Create Question Schema (Governance-Aware) ──────────────────────────────

export const createQuestionSchema = z
  .object({
    question: z
      .string()
      .min(10, "Question must be at least 10 characters")
      .max(2000, "Question must not exceed 2000 characters"),
    explanation: z
      .string()
      .min(1, "Explanation is required")
      .max(3000, "Explanation must not exceed 3000 characters"),
    subject: z
      .string()
      .min(1, "Subject is required")
      .max(100, "Subject must not exceed 100 characters"),
    topic: z.string().max(100, "Topic must not exceed 100 characters").optional(),
    category: z
      .string()
      .min(1, "Category is required")
      .max(100, "Category must not exceed 100 characters"),
    language: z.string().max(10).default("en"),
    marks: z
      .number()
      .int("Marks must be a whole number")
      .min(1, "At least 1 mark is required")
      .max(10, "Cannot exceed 10 marks"),
    negativeMarks: z
      .number()
      .min(0, "Negative marks cannot be negative")
      .max(1, "Cannot exceed 100%"),
    difficulty: z.enum(QUESTION_DIFFICULTIES).default("MEDIUM"),
    tags: z.array(z.string().max(50)).max(20).default([]),
    healthScore: z.number().int().min(0).max(100).optional(),
    healthGrade: z.enum(["A+", "A", "B", "C", "D"]).optional(),
    healthStatus: z.enum(["EXCELLENT", "GOOD", "NEEDS_IMPROVEMENT", "POOR"]).optional(),
    options: z
      .array(
        z.object({
          optionText: z.string().min(1, "Option text is required").max(500, "Option too long"),
          isCorrect: z.boolean(),
          order: z.number().int(),
        })
      )
      .min(4, "At least 4 options are required")
      .max(6, "Cannot have more than 6 options"),
  })
  .refine((data) => data.options.filter((opt) => opt.isCorrect).length === 1, {
    message: "Exactly one option must be marked as correct",
  })
  .refine(
    (data) => {
      const texts = data.options.map((opt) => opt.optionText.toLowerCase().trim());
      return new Set(texts).size === texts.length;
    },
    { message: "Duplicate options are not allowed" }
  );

// ─── Draft Question Schema (Permissive for Autosave) ─────────────────────────

export const draftQuestionSchema = z.object({
  id: z.string().cuid().optional(),
  question: z.string().max(2000, "Question must not exceed 2000 characters").optional(),
  explanation: z.string().max(3000, "Explanation must not exceed 3000 characters").optional(),
  subject: z.string().max(100, "Subject must not exceed 100 characters").optional(),
  topic: z.string().max(100, "Topic must not exceed 100 characters").optional(),
  category: z.string().max(100, "Category must not exceed 100 characters").optional(),
  language: z.string().max(10).default("en"),
  marks: z.number().int().min(1).max(10).optional(),
  negativeMarks: z.number().min(0).max(1).optional(),
  difficulty: z.enum(QUESTION_DIFFICULTIES).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  healthScore: z.number().int().min(0).max(100).optional(),
  healthGrade: z.enum(["A+", "A", "B", "C", "D"]).optional(),
  healthStatus: z.enum(["EXCELLENT", "GOOD", "NEEDS_IMPROVEMENT", "POOR"]).optional(),
  options: z
    .array(
      z.object({
        id: z.string().cuid().optional(),
        optionText: z.string().max(500, "Option too long").optional(),
        isCorrect: z.boolean().optional(),
        order: z.number().int(),
      })
    )
    .max(6, "Cannot have more than 6 options")
    .optional(),
});

// ─── Update Question Schema ────────────────────────────────────────────────

export const updateQuestionSchema = z
  .object({
    id: z.string().cuid("Invalid question ID"),
    question: z
      .string()
      .min(10, "Question must be at least 10 characters")
      .max(2000, "Question must not exceed 2000 characters")
      .optional(),
    explanation: z
      .string()
      .min(1, "Explanation is required")
      .max(3000, "Explanation must not exceed 3000 characters")
      .optional(),
    subject: z
      .string()
      .min(1, "Subject is required")
      .max(100, "Subject must not exceed 100 characters")
      .optional(),
    topic: z.string().max(100, "Topic must not exceed 100 characters").optional(),
    category: z
      .string()
      .min(1, "Category is required")
      .max(100, "Category must not exceed 100 characters")
      .optional(),
    language: z.string().max(10).optional(),
    marks: z
      .number()
      .int("Marks must be a whole number")
      .min(1, "At least 1 mark is required")
      .max(10, "Cannot exceed 10 marks")
      .optional(),
    negativeMarks: z
      .number()
      .min(0, "Negative marks cannot be negative")
      .max(1, "Cannot exceed 100%")
      .optional(),
    difficulty: z.enum(QUESTION_DIFFICULTIES).optional(),
    tags: z.array(z.string().max(50)).max(20).optional(),
    healthScore: z.number().int().min(0).max(100).optional(),
    healthGrade: z.enum(["A+", "A", "B", "C", "D"]).optional(),
    healthStatus: z.enum(["EXCELLENT", "GOOD", "NEEDS_IMPROVEMENT", "POOR"]).optional(),
    options: z
      .array(
        z.object({
          optionText: z.string().min(1, "Option text is required").max(500, "Option too long"),
          isCorrect: z.boolean(),
          order: z.number().int(),
        })
      )
      .min(4, "At least 4 options are required")
      .max(6, "Cannot have more than 6 options")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.options) {
        const correctCount = data.options.filter((opt) => opt.isCorrect).length;
        return correctCount === 1;
      }
      return true;
    },
    { message: "Exactly one option must be marked as correct" }
  )
  .refine(
    (data) => {
      if (data.options) {
        const texts = data.options.map((opt) => opt.optionText.toLowerCase().trim());
        return new Set(texts).size === texts.length;
      }
      return true;
    },
    { message: "Duplicate options are not allowed" }
  );

// ─── ID Schema ──────────────────────────────────────────────────────────────

export const questionIdSchema = z.object({
  id: z.string().cuid("Invalid question ID"),
});

// ─── Status Transition Schema ───────────────────────────────────────────────

export const questionStatusTransitionSchema = z.object({
  id: z.string().cuid("Invalid question ID"),
  newStatus: z.enum(QUESTION_STATUSES),
  reason: z.string().max(1000).optional(),
});

// ─── Filters Schema (Governance-Aware) ──────────────────────────────────────

export const questionFiltersSchema = z.object({
  search: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  subject: z.string().max(100).optional(),
  topic: z.string().max(100).optional(),
  difficulty: z.enum(QUESTION_DIFFICULTIES).optional(),
  status: z.enum(QUESTION_STATUSES).optional(),
  tags: z.array(z.string()).optional(),
  createdBy: z.string().optional(),
  approvedBy: z.string().optional(),
  intelligence: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// ─── Governance Transition Validation ───────────────────────────────────────

const VALID_QUESTION_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["REVIEW"],
  REVIEW: ["DRAFT", "APPROVED", "REJECTED"],
  APPROVED: ["ARCHIVED", "FLAGGED"],
  REJECTED: ["DRAFT", "FLAGGED"],
  ARCHIVED: ["DRAFT", "FLAGGED"],
  FLAGGED: ["DRAFT", "ARCHIVED"],
};

export function isValidStatusTransition(current: string, target: string): boolean {
  const allowed = VALID_QUESTION_TRANSITIONS[current] || [];
  return allowed.includes(target);
}

// ─── Type Exports ───────────────────────────────────────────────────────────

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type QuestionFilters = z.infer<typeof questionFiltersSchema>;
export type QuestionStatusTransition = z.infer<typeof questionStatusTransitionSchema>;
export type QuestionOption = z.infer<typeof questionOptionSchema>;
export type DraftQuestionInput = z.infer<typeof draftQuestionSchema>;
