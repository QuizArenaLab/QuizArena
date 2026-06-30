import { z } from "zod";
import {
  CompetitionType,
  CompetitionVisibility,
  ChallengeDifficulty,
  ExamCategory,
} from "@/generated/prisma";

// Reusing enum arrays for Zod validation
const competitionTypeValues = [
  "OPEN_PRACTICE",
  "FREE_CHALLENGE",
  "PAID_CHALLENGE",
  "MOCK_TEST",
  "TOURNAMENT",
] as const;

const examCategoryValues = ["SSC", "BANKING", "RAILWAYS", "STATE_PSC"] as const;

const difficultyValues = ["BEGINNER", "MEDIUM", "HARDCORE"] as const;

export const createCompetitionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional().nullable(),
  competitionType: z.enum(competitionTypeValues, { message: "Competition type is required" }),
  exam: z.enum(examCategoryValues).optional().nullable(),
  difficulty: z.enum(difficultyValues, { message: "Difficulty is required" }),
  language: z.string().default("en"),
  durationMinutes: z.number().int().min(1, "Duration must be at least 1 minute"),
});

export const updateBasicsSchema = createCompetitionSchema.partial().extend({
  id: z.string().cuid("Invalid competition ID"),
});

export const competitionRulesJsonSchema = z.object({
  timeLimit: z.boolean(),
  negativeMarking: z.boolean(),
  randomQuestionOrder: z.boolean(),
  randomOptionOrder: z.boolean(),
  passingCriteria: z
    .object({
      type: z.enum(["percentage", "absolute"]),
      value: z.number().min(0),
    })
    .nullable(),
  attemptLimit: z.number().int().min(0),
  calculatorAllowed: z.boolean(),
  reviewAllowed: z.boolean(),
  bookmarkAllowed: z.boolean(),
  sectionNavigation: z.enum(["free", "sequential", "locked"]),
});

export const competitionConfigSchema = z.object({
  durationMinutes: z.number().int().min(1),
  maximumMarks: z.number().int().min(0),
  negativeMarkingEnabled: z.boolean(),
  negativeMarkPerQuestion: z.number().min(0),
  passingMarks: z.number().int().min(0).optional().nullable(),
  allowRetake: z.boolean(),
  randomizeQuestions: z.boolean(),
  randomizeOptions: z.boolean(),
  rules: competitionRulesJsonSchema.optional(),
});

export const competitionEconomicsSchema = z.object({
  entryFee: z.number().min(0),
  rewardPool: z.number().min(0),
  currency: z.string().default("INR"),
});

export const competitionEligibilityJsonSchema = z.object({
  mode: z.enum([
    "EVERYONE",
    "PREMIUM_ONLY",
    "SPECIFIC_EXAMS",
    "INVITATION_ONLY",
    "INSTITUTION",
    "ORGANIZATION",
    "COLLEGE",
  ]),
  allowedExams: z.array(z.string()).optional(),
  allowedInstitutions: z.array(z.string()).optional(),
  inviteCodes: z.array(z.string()).optional(),
  premiumTierRequired: z.string().optional(),
});

export const competitionEligibilitySchema = z.object({
  criteria: competitionEligibilityJsonSchema.optional(),
  maxParticipants: z.number().int().min(1).optional().nullable(),
});

export const attachQuestionsSchema = z.object({
  competitionId: z.string().cuid(),
  questionIds: z.array(z.string()),
});

export const createSectionSchema = z.object({
  title: z.string().min(1).max(50),
  slug: z.string().min(1).max(50),
  description: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  durationMinutes: z.number().int().min(1).optional().nullable(),
  isMandatory: z.boolean().default(true),
  allowNavigation: z.boolean().default(true),
});

export const transitionStatusSchema = z.object({
  competitionId: z.string().cuid(),
  targetStatus: z.enum(["DRAFT", "READY", "SCHEDULED", "LIVE", "COMPLETED", "EXPIRED", "ARCHIVED"]),
  reason: z.string().optional(),
});
