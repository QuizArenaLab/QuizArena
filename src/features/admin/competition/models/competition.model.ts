import {
  CompetitionStatus,
  CompetitionType,
  CompetitionVisibility,
  ExamCategory,
} from "@/generated/prisma";
import { CompetitionEligibilityCriteria, CompetitionRules } from "../types";

export const COMPETITION_TYPE_LABELS: Record<CompetitionType, string> = {
  OPEN_PRACTICE: "Open Practice",
  FREE_CHALLENGE: "Free Challenge",
  PAID_CHALLENGE: "Paid Challenge",
  MOCK_TEST: "Mock Test",
  TOURNAMENT: "Tournament",
};

export const COMPETITION_STATUS_LABELS: Record<CompetitionStatus, string> = {
  DRAFT: "Draft",
  READY: "Ready",
  PUBLISHING: "Publishing",
  SCHEDULED: "Scheduled",
  LIVE: "Live",
  COMPLETED: "Completed",
  EXPIRED: "Expired",
  ARCHIVED: "Archived",
};

export const COMPETITION_VISIBILITY_LABELS: Record<CompetitionVisibility, string> = {
  PUBLIC: "Public",
  PRIVATE: "Private",
  INVITE_ONLY: "Invite Only",
};

export const COMPETITION_STATUS_TRANSITIONS: Record<CompetitionStatus, CompetitionStatus[]> = {
  DRAFT: ["READY"],
  READY: ["PUBLISHING", "SCHEDULED", "DRAFT"],
  PUBLISHING: ["LIVE", "READY"],
  SCHEDULED: ["PUBLISHING", "READY"],
  LIVE: ["COMPLETED"],
  COMPLETED: ["ARCHIVED"],
  EXPIRED: ["ARCHIVED"],
  ARCHIVED: [],
};

export const DEFAULT_COMPETITION_RULES: CompetitionRules = {
  timeLimit: true,
  negativeMarking: false,
  randomQuestionOrder: false,
  randomOptionOrder: false,
  passingCriteria: null,
  attemptLimit: 1,
  calculatorAllowed: false,
  reviewAllowed: true,
  bookmarkAllowed: true,
  sectionNavigation: "free",
};

export const DEFAULT_COMPETITION_ELIGIBILITY: CompetitionEligibilityCriteria = {
  mode: "EVERYONE",
  allowedExams: [],
  allowedInstitutions: [],
  inviteCodes: [],
  premiumTierRequired: undefined,
};

export const EXAM_CATEGORY_LABELS: Record<ExamCategory, string> = {
  SSC: "SSC",
  BANKING: "Banking",
  RAILWAYS: "Railways",
  STATE_PSC: "State PSC",
};
