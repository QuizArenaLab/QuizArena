import type {
  Competition,
  CompetitionConfig,
  CompetitionEconomics,
  CompetitionEligibility as PrismaCompetitionEligibility,
  CompetitionSection,
  CompetitionQuestion,
  Question,
  CompetitionStatus,
  CompetitionType,
  CompetitionVisibility,
  ChallengeDifficulty,
  ExamCategory,
  CompetitionAudit,
  CompetitionVersion,
  CompetitionSchedule,
  PublishingLock,
} from "@/generated/prisma";

// ─── JSON Configuration Types ─────────────────────────────────────────────

export interface CompetitionRules {
  timeLimit: boolean;
  negativeMarking: boolean;
  randomQuestionOrder: boolean;
  randomOptionOrder: boolean;
  passingCriteria: { type: "percentage" | "absolute"; value: number } | null;
  attemptLimit: number; // 0 = unlimited
  calculatorAllowed: boolean;
  reviewAllowed: boolean;
  bookmarkAllowed: boolean;
  sectionNavigation: "free" | "sequential" | "locked";
}

export type EligibilityMode =
  | "EVERYONE"
  | "PREMIUM_ONLY"
  | "SPECIFIC_EXAMS"
  | "INVITATION_ONLY"
  | "INSTITUTION"
  | "ORGANIZATION"
  | "COLLEGE";

export interface CompetitionEligibilityCriteria {
  mode: EligibilityMode;
  allowedExams?: ExamCategory[];
  allowedInstitutions?: string[];
  inviteCodes?: string[];
  premiumTierRequired?: string;
}

// ─── Extended Prisma Types ────────────────────────────────────────────────

export type CompetitionWithRelations = Competition & {
  config: CompetitionConfig | null;
  economics: CompetitionEconomics | null;
  eligibility: PrismaCompetitionEligibility | null;
  sections: CompetitionSection[];
  questions: (CompetitionQuestion & { question: Question })[];
  auditTrail?: CompetitionAudit[];
  versions?: CompetitionVersion[];
  schedule?: CompetitionSchedule | null;
  publishingLock?: PublishingLock | null;
};

export type CompetitionListItem = Pick<
  Competition,
  | "id"
  | "title"
  | "slug"
  | "competitionType"
  | "status"
  | "visibility"
  | "exam"
  | "difficulty"
  | "totalQuestions"
  | "durationMinutes"
  | "startsAt"
  | "endsAt"
  | "createdAt"
>;

// ─── Form Types ─────────────────────────────────────────────────────────

export interface CompetitionFormBasics {
  title: string;
  description?: string | null;
  competitionType: CompetitionType;
  exam?: ExamCategory | null;
  difficulty: ChallengeDifficulty;
  language: string;
}

export interface CompetitionFormConfig {
  durationMinutes: number;
  maximumMarks: number;
  negativeMarkingEnabled: boolean;
  negativeMarkPerQuestion: number;
  passingMarks?: number | null;
  allowRetake: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
}

// ─── Publishing & Validation Types ──────────────────────────────────────

export interface PublishCheck {
  id: string;
  label: string;
  passed: boolean;
  severity: "error" | "warning";
  message?: string;
}

export interface PublishValidationResult {
  canPublish: boolean;
  checks: PublishCheck[];
}

export interface ValidationGateResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ─── Service Request Types ──────────────────────────────────────────────

export interface GetCompetitionsParams {
  search?: string;
  status?: CompetitionStatus;
  type?: CompetitionType;
  exam?: ExamCategory;
  page?: number;
  limit?: number;
}
