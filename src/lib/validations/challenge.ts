import { z } from "zod";

export const CHALLENGE_CATEGORIES = ["SSC", "BANKING", "RAILWAYS", "STATE_PSC"] as const;

export const CHALLENGE_DIFFICULTIES = ["BEGINNER", "MEDIUM", "HARDCORE"] as const;

export const CHALLENGE_STATUSES = ["DRAFT", "SCHEDULED", "LIVE", "ENDED", "ARCHIVED"] as const;

export const createChallengeSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Title can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  description: z.string().max(2000, "Description must not exceed 2000 characters").optional(),
  instructions: z.string().max(2000, "Instructions must not exceed 2000 characters").optional(),
  category: z.enum(CHALLENGE_CATEGORIES).optional().describe("Exam category"),
  difficulty: z.enum(CHALLENGE_DIFFICULTIES).default("MEDIUM").describe("Challenge difficulty"),
  durationInMinutes: z
    .number()
    .int("Duration must be a whole number")
    .min(5, "Duration must be at least 5 minutes")
    .max(180, "Duration must not exceed 180 minutes"),
  totalQuestions: z
    .number()
    .int("Total questions must be a whole number")
    .min(1, "At least 1 question is required")
    .max(200, "Cannot exceed 200 questions"),
  totalMarks: z
    .number()
    .int("Total marks must be a whole number")
    .min(1, "At least 1 mark is required")
    .max(1000, "Cannot exceed 1000 marks"),
  negativeMarking: z.boolean().default(false),
  negativeMarkPercentage: z
    .number()
    .min(0, "Negative mark percentage cannot be negative")
    .max(1, "Negative mark percentage cannot exceed 100%")
    .default(0.25),
});

export const updateChallengeSchema = createChallengeSchema.partial().extend({
  id: z.string().cuid("Invalid challenge ID"),
});

export const challengeIdSchema = z.object({
  id: z.string().cuid("Invalid challenge ID"),
});

export const challengeSlugSchema = z.object({
  slug: z
    .string()
    .min(3, "Invalid slug")
    .max(200, "Slug too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
});

export const challengeStatusTransitionSchema = z.object({
  id: z.string().cuid("Invalid challenge ID"),
  newStatus: z.enum(CHALLENGE_STATUSES),
});

export const challengeFiltersSchema = z.object({
  search: z.string().max(100).optional(),
  status: z.enum(CHALLENGE_STATUSES).optional(),
  difficulty: z.enum(CHALLENGE_DIFFICULTIES).optional(),
  category: z.enum(CHALLENGE_CATEGORIES).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeInput = z.infer<typeof updateChallengeSchema>;
export type ChallengeFilters = z.infer<typeof challengeFiltersSchema>;
export type ChallengeStatusTransition = z.infer<typeof challengeStatusTransitionSchema>;

export const scheduleChallengeSchema = z
  .object({
    id: z.string().cuid("Invalid challenge ID"),
    startsAt: z.string().datetime("Invalid start date/time"),
    endsAt: z.string().datetime("Invalid end date/time"),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startsAt);
      const now = new Date();
      return startDate > now;
    },
    { message: "Scheduled start time must be in the future" }
  )
  .refine(
    (data) => {
      const startDate = new Date(data.startsAt);
      const endDate = new Date(data.endsAt);
      return endDate > startDate;
    },
    { message: "End time must be after start time" }
  );

export type ScheduleChallengeInput = z.infer<typeof scheduleChallengeSchema>;

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ─── Challenge Builder Validations ────────────────────────────────

export const builderAddQuestionSchema = z.object({
  challengeId: z.string().cuid("Invalid challenge ID"),
  questionId: z.string().cuid("Invalid question ID"),
});

export const builderRemoveQuestionSchema = z.object({
  challengeId: z.string().cuid("Invalid challenge ID"),
  questionId: z.string().cuid("Invalid question ID"),
});

export const builderReorderQuestionsSchema = z.object({
  challengeId: z.string().cuid("Invalid challenge ID"),
  questionIds: z.array(z.string().cuid("Invalid question ID")),
});

export type BuilderAddQuestionInput = z.infer<typeof builderAddQuestionSchema>;
export type BuilderRemoveQuestionInput = z.infer<typeof builderRemoveQuestionSchema>;
export type BuilderReorderQuestionsInput = z.infer<typeof builderReorderQuestionsSchema>;
