import { Competition } from '@/generated/prisma';
import { CompetitionDTO } from '../types/dto';

export function toCompetitionDTO(competition: Competition): CompetitionDTO {
  return {
    id: competition.id,
    title: competition.title,
    slug: competition.slug,
    description: competition.description,
    competitionType: competition.competitionType,
    status: competition.status,
    lifecycleState: competition.lifecycleState,
    visibility: competition.visibility,
    exam: competition.exam,
    difficulty: competition.difficulty,
    durationMinutes: competition.durationMinutes,
    totalQuestions: competition.totalQuestions,
    maximumMarks: competition.maximumMarks,
    startsAt: competition.startsAt,
    endsAt: competition.endsAt,
    createdAt: competition.createdAt,
    updatedAt: competition.updatedAt,
  };
}
