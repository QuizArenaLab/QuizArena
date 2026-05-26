import { z } from "zod";

export const analyticsTimeRangeSchema = z.enum(["daily", "weekly", "monthly", "all"]);

export const challengeAnalyticsFilterSchema = z.object({
  challengeId: z.string().optional(),
  timeRange: analyticsTimeRangeSchema.default("all"),
  category: z.enum(["SSC", "BANKING", "RAILWAYS", "STATE_PSC"]).optional(),
  difficulty: z.enum(["BEGINNER", "MEDIUM", "HARDCORE"]).optional(),
});

export const questionAnalyticsFilterSchema = z.object({
  questionId: z.string().optional(),
  timeRange: analyticsTimeRangeSchema.default("all"),
  difficulty: z.enum(["BEGINNER", "MEDIUM", "HARDCORE"]).optional(),
  subject: z.string().optional(),
  topic: z.string().optional(),
  minAccuracy: z.number().min(0).max(100).optional(),
  maxAccuracy: z.number().min(0).max(100).optional(),
});

export const refreshAnalyticsSchema = z.object({
  challengeId: z.string().optional(),
  questionId: z.string().optional(),
  refreshAll: z.boolean().default(false),
});

export type AnalyticsTimeRange = z.infer<typeof analyticsTimeRangeSchema>;
export type ChallengeAnalyticsFilter = z.infer<typeof challengeAnalyticsFilterSchema>;
export type QuestionAnalyticsFilter = z.infer<typeof questionAnalyticsFilterSchema>;
export type RefreshAnalyticsInput = z.infer<typeof refreshAnalyticsSchema>;
