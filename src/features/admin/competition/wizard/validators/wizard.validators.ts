import { z } from "zod";
import {
  CompetitionType,
  ExamCategory,
  ChallengeDifficulty,
  CompetitionVisibility,
} from "@/generated/prisma";

export const competitionBasicsSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  competitionType: z.nativeEnum(CompetitionType, {
    error: "Competition Type is required",
  }),
  exam: z.nativeEnum(ExamCategory, { error: "Exam is required" }),
  language: z.string().min(2, "Language is required"),
  difficulty: z.nativeEnum(ChallengeDifficulty, { error: "Difficulty is required" }),
});

export const competitionConfigSchema = z
  .object({
    durationMinutes: z
      .number()
      .min(1, "Duration must be at least 1 minute")
      .max(1440, "Duration must not exceed 24 hours"),
    passingMarks: z.number().min(0, "Passing marks cannot be negative"),
    maximumMarks: z.number().min(1, "Maximum marks must be at least 1"),
    negativeMarkingEnabled: z.boolean(),
    negativeMarkPerQuestion: z.number().min(0, "Negative marks cannot be negative"),
    randomizeQuestions: z.boolean(),
    randomizeOptions: z.boolean(),
    attemptLimit: z.number().min(1, "Attempt limit must be at least 1"),
    reviewAllowed: z.boolean(),
    bookmarkAllowed: z.boolean(),
    sectionNavigation: z.enum(["FREE", "STRICT"]),
    calculatorAllowed: z.boolean(),
  })
  .refine(
    (data) => {
      return data.passingMarks <= data.maximumMarks;
    },
    {
      message: "Passing marks cannot exceed maximum marks",
      path: ["passingMarks"],
    }
  );

export const competitionParticipationSchema = z
  .object({
    visibility: z.nativeEnum(CompetitionVisibility, { error: "Visibility is required" }),
    startsAt: z
      .string()
      .refine((val) => val === "" || !isNaN(Date.parse(val)), { message: "Invalid Start Date" })
      .optional()
      .nullable(),
    endsAt: z
      .string()
      .refine((val) => val === "" || !isNaN(Date.parse(val)), { message: "Invalid End Date" })
      .optional()
      .nullable(),

    maxParticipants: z.number().min(1, "Max participants must be at least 1").optional().nullable(),
    allowRetake: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return new Date(data.endsAt) > new Date(data.startsAt);
      }
      return true;
    },
    {
      message: "End Date must be after Start Date",
      path: ["endsAt"],
    }
  );

export const composerQuestionSchema = z.object({
  id: z.string().optional(), // Draft local ID
  questionId: z.string(),
  displayOrder: z.number().default(0),
  marks: z.number().default(1),
  negativeMarks: z.number().default(0),
  questionWeight: z.number().default(1.0),
  isOptional: z.boolean().default(false),
  isBonus: z.boolean().default(false),
  isMandatory: z.boolean().default(true),
});

export const composerSectionSchema = z.object({
  id: z.string().optional(), // Draft local ID
  title: z.string().min(1, "Section title is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  instructions: z.string().optional(),
  displayOrder: z.number().default(0),
  durationMinutes: z.number().optional().nullable(),
  totalQuestions: z.number().default(0),
  maximumMarks: z.number().default(0),
  passingMarks: z.number().optional().nullable(),
  isMandatory: z.boolean().default(true),
  allowNavigation: z.boolean().default(true),
  questions: z.array(composerQuestionSchema).default([]),
});

export const competitionComposerSchema = z.object({
  sections: z.array(composerSectionSchema).default([]),
});

export const competitionCertificatesSchema = z.object({
  enableCertificates: z.boolean().default(false),
  certificateTemplateId: z.string().optional(),
  passingThreshold: z.number().min(0).max(100).optional(),
});

export const createDraftWizardSchema = z.object({
  basics: competitionBasicsSchema,
  config: competitionConfigSchema,
  participation: competitionParticipationSchema,
  composer: competitionComposerSchema.optional(),
});
