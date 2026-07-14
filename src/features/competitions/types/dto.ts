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

// ─── Management DTOs ────────────────────────────────

export interface CompetitionConfigDTO {
  id: string;
  competitionId: string;
  negativeMarkingEnabled: boolean;
  negativeMarkPerQuestion: number;
  passingMarks: number | null;
  allowRetake: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
}

export interface UpdateCompetitionConfigDTO {
  negativeMarkingEnabled?: boolean;
  negativeMarkPerQuestion?: number;
  passingMarks?: number | null;
  allowRetake?: boolean;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
}

export interface CompetitionEconomicsDTO {
  id: string;
  competitionId: string;
  entryFee: number;
  rewardPool: number;
  currency: string;
}

export interface UpdateCompetitionEconomicsDTO {
  entryFee?: number;
  rewardPool?: number;
  currency?: string;
}

export interface CompetitionEligibilityDTO {
  id: string;
  competitionId: string;
  maxParticipants: number | null;
}

export interface UpdateCompetitionEligibilityDTO {
  maxParticipants?: number | null;
}

export interface CompetitionSectionDTO {
  id: string;
  competitionId: string;
  title: string;
  slug: string;
  description: string | null;
  instructions: string | null;
  displayOrder: number;
  durationMinutes: number | null;
  totalQuestions: number;
  maximumMarks: number;
  passingMarks: number | null;
  isMandatory: boolean;
  allowNavigation: boolean;
}

export interface CreateCompetitionSectionDTO {
  title: string;
  slug: string;
  description?: string;
  instructions?: string;
  displayOrder?: number;
  durationMinutes?: number;
  passingMarks?: number;
  isMandatory?: boolean;
  allowNavigation?: boolean;
}

export interface CompetitionQuestionDTO {
  id: string;
  competitionId: string;
  questionId: string;
  sectionId: string | null;
  displayOrder: number;
  sectionOrder: number;
  marks: number;
  negativeMarks: number;
  questionWeight: number;
  isOptional: boolean;
  isBonus: boolean;
  isMandatory: boolean;
}

export interface AddCompetitionQuestionDTO {
  questionId: string;
  sectionId?: string;
  displayOrder?: number;
  marks?: number;
  negativeMarks?: number;
  isOptional?: boolean;
  isBonus?: boolean;
}

// ─── Lifecycle & Scheduling DTOs ────────────────────

export interface CompetitionScheduleDTO {
  id: string;
  competitionId: string;
  publishAt: Date | null;
  expiresAt: Date | null;
  timezone: string;
  status: string;
  executedAt: Date | null;
  executionLog: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateScheduleDTO {
  publishAt: string; // ISO date string
  expiresAt?: string;
  timezone?: string;
}

export interface LifecycleTransitionDTO {
  targetState: string;
  reason?: string;
}

export interface CompetitionLifecycleAuditDTO {
  id: string;
  competitionId: string;
  previousState: string | null;
  newState: string;
  reason: string | null;
  performedBy: string | null;
  performedByType: string;
  createdAt: Date;
}
