import { z } from 'zod';
import { 
  CompetitionType, 
  ExamCategory, 
  ChallengeDifficulty, 
  CompetitionVisibility 
} from '@/generated/prisma';

export const createCompetitionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be url-safe'),
  description: z.string().optional(),
  competitionType: z.nativeEnum(CompetitionType),
  durationMinutes: z.number().int().positive('Duration must be positive'),
  exam: z.nativeEnum(ExamCategory).optional(),
  difficulty: z.nativeEnum(ChallengeDifficulty).optional(),
  visibility: z.nativeEnum(CompetitionVisibility).optional(),
});

export const updateCompetitionSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().optional(),
  competitionType: z.nativeEnum(CompetitionType).optional(),
  durationMinutes: z.number().int().positive().optional(),
  exam: z.nativeEnum(ExamCategory).optional(),
  difficulty: z.nativeEnum(ChallengeDifficulty).optional(),
  visibility: z.nativeEnum(CompetitionVisibility).optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
});
