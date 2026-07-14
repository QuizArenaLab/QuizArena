import { 
  CompetitionType, 
  CompetitionLifecycle, 
  CompetitionStatus, 
  CompetitionVisibility, 
  ExamCategory, 
  ChallengeDifficulty 
} from '@/generated/prisma';

export interface CompetitionDTO {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  competitionType: CompetitionType;
  status: CompetitionStatus;
  lifecycleState: CompetitionLifecycle;
  visibility: CompetitionVisibility;
  exam: ExamCategory | null;
  difficulty: ChallengeDifficulty;
  durationMinutes: number;
  totalQuestions: number;
  maximumMarks: number;
  startsAt: Date | null;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompetitionDTO {
  title: string;
  slug: string;
  description?: string;
  competitionType: CompetitionType;
  durationMinutes: number;
  exam?: ExamCategory;
  difficulty?: ChallengeDifficulty;
  visibility?: CompetitionVisibility;
}

export interface UpdateCompetitionDTO {
  title?: string;
  slug?: string;
  description?: string;
  competitionType?: CompetitionType;
  durationMinutes?: number;
  exam?: ExamCategory;
  difficulty?: ChallengeDifficulty;
  visibility?: CompetitionVisibility;
  startsAt?: Date;
  endsAt?: Date;
}
