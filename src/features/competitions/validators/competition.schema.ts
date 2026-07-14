import { z } from "zod";
import {
  CompetitionType,
  ExamCategory,
  ChallengeDifficulty,
  CompetitionVisibility,
} from "@/generated/prisma";

export const createCompetitionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be url-safe"),
  description: z.string().optional(),
  competitionType: z.nativeEnum(CompetitionType),
  durationMinutes: z.number().int().positive("Duration must be positive"),
  exam: z.nativeEnum(ExamCategory).optional(),
  difficulty: z.nativeEnum(ChallengeDifficulty).optional(),
  visibility: z.nativeEnum(CompetitionVisibility).optional(),
});

export const updateCompetitionSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: z.string().optional(),
  competitionType: z.nativeEnum(CompetitionType).optional(),
  durationMinutes: z.number().int().positive().optional(),
  exam: z.nativeEnum(ExamCategory).optional(),
  difficulty: z.nativeEnum(ChallengeDifficulty).optional(),
  visibility: z.nativeEnum(CompetitionVisibility).optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
});

// ─── Management Schemas ────────────────────────────

export const updateCompetitionConfigSchema = z.object({
  negativeMarkingEnabled: z.boolean().optional(),
  negativeMarkPerQuestion: z.number().min(0).optional(),
  passingMarks: z.number().int().min(0).nullable().optional(),
  allowRetake: z.boolean().optional(),
  randomizeQuestions: z.boolean().optional(),
  randomizeOptions: z.boolean().optional(),
});

export const updateCompetitionEconomicsSchema = z.object({
  entryFee: z.number().min(0).optional(),
  rewardPool: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
});

export const updateCompetitionEligibilitySchema = z.object({
  maxParticipants: z.number().int().positive().nullable().optional(),
});

export const createCompetitionSectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be url-safe"),
  description: z.string().optional(),
  instructions: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
  durationMinutes: z.number().int().positive().optional(),
  passingMarks: z.number().int().min(0).optional(),
  isMandatory: z.boolean().optional(),
  allowNavigation: z.boolean().optional(),
});

export const addCompetitionQuestionSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  sectionId: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
  marks: z.number().int().min(0).optional(),
  negativeMarks: z.number().min(0).optional(),
  isOptional: z.boolean().optional(),
  isBonus: z.boolean().optional(),
});
