import { z } from "zod";
import { CompetitionLifecycle } from "@/generated/prisma";

export const lifecycleTransitionSchema = z.object({
  targetState: z.nativeEnum(CompetitionLifecycle),
  reason: z.string().optional(),
});

export const createScheduleSchema = z.object({
  publishAt: z.string().datetime({ message: "publishAt must be a valid ISO date" }),
  expiresAt: z.string().datetime().optional(),
  timezone: z.string().min(1).optional(),
});
