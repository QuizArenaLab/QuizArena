/**
 * QuizArena — Reports & Abuse Management Type Definitions
 *
 * Enterprise-grade trust & safety types for operational abuse governance.
 * Covers reports, moderation workflows, severity classification, and audit trails.
 */

// ─── ENUMS (mirroring Prisma) ─────────────────────────────────

export type ReportStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
export type ReportPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ReportType =
  | "USER_ABUSE"
  | "CHEATING"
  | "SPAM"
  | "INAPPROPRIATE_CONTENT"
  | "CHALLENGE_ISSUE"
  | "QUESTION_ERROR"
  | "OTHER";

// ─── REPORT DATA ──────────────────────────────────────────────

export interface ReportData {
  id: string;
  type: ReportType;
  reason: string;
  description: string | null;
  status: ReportStatus;
  priority: ReportPriority;
  reportedBy: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  targetUser: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    accountState: string;
    flagged: boolean;
  } | null;
  targetChallenge: {
    id: string;
    title: string;
    status: string;
  } | null;
  targetQuestion: {
    id: string;
    question: string;
    status: string;
  } | null;
  reviewedBy: {
    id: string;
    name: string | null;
  } | null;
  updatedAt: string | null;
  resolutionNotes: string | null;
  notes: ReportNoteData[];
  createdAt: string;
}

export interface ReportNoteData {
  id: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
  };
}

// ─── DASHBOARD AGGREGATIONS ───────────────────────────────────

export interface ReportsDashboardData {
  summary: ReportsSummary;
  statusCounts: ReportStatusCounts;
  agingMetrics: ReportAgingMetrics;
  platformHealth: PlatformHealthMetrics;
  recentReports: ReportData[];
  highPriorityReports: ReportData[];
  recentModActions: ModerationActionRecord[];
  abuseTrends: AbuseTrendPoint[];
  suspiciousActivity: SuspiciousActivitySignal[];
  abuseIntelligence: AbuseIntelligence;
}

export interface ReportStatusCounts {
  OPEN: number;
  UNDER_REVIEW: number;
  CRITICAL: number;
  RESOLVED: number;
  DISMISSED: number;
}

export interface ReportAgingMetrics {
  under24h: number;
  between24hAnd48h: number;
  over48h: number;
}

export interface PlatformHealthMetrics {
  reportsMonitoredToday: number;
  competitionsMonitored: number;
  usersMonitored: number;
  lastResolvedIncident: string | null;
}

export interface ReportsSummary {
  totalOpen: number;
  totalUnderReview: number;
  totalResolved: number;
  totalDismissed: number;
  totalCritical: number;
  totalHigh: number;
  totalReportsToday: number;
  totalReportsWeek: number;
  averageResolutionHours: number;
  falseReportRate: number;
}

export interface AbuseIntelligence {
  topUsers: { id: string; name: string | null; reportCount: number }[];
  topCompetitions: { id: string; title: string; reportCount: number }[];
  commonAbuseTypes: { type: ReportType; count: number }[];
  repeatOffendersCount: number;
}

export interface ModerationActionRecord {
  id: string;
  action: string;
  description: string;
  performedBy: string;
  timestamp: string;
  reportId?: string;
}

export interface AbuseTrendPoint {
  date: string;
  reports: number;
  resolved: number;
  critical: number;
}

export interface SuspiciousActivitySignal {
  id: string;
  type: "repeated_reports" | "rapid_submissions" | "flagged_user" | "cheating_pattern";
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timestamp: string;
  relatedEntityId?: string;
  relatedEntityType?: "user" | "challenge" | "question";
}

// ─── FILTERS ──────────────────────────────────────────────────

export interface ReportFilters {
  status?: ReportStatus;
  priority?: ReportPriority;
  type?: ReportType;
  reviewerId?: string;
  search?: string;
}

// ─── FORM INPUTS ──────────────────────────────────────────────

export interface SubmitReportInput {
  type: ReportType;
  reason: string;
  description?: string;
  targetUserId?: string;
  targetChallengeId?: string;
  targetQuestionId?: string;
}

export interface ResolveReportInput {
  reportId: string;
  resolutionNotes: string;
}

export interface AddReportNoteInput {
  reportId: string;
  content: string;
}

// ─── ACTION RESULTS ───────────────────────────────────────────

export interface ActionResult {
  success: boolean;
  message: string;
  reportId?: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  OPEN: "Open",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
  DISMISSED: "Dismissed",
};

export const REPORT_PRIORITY_LABELS: Record<ReportPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  USER_ABUSE: "User Abuse",
  CHEATING: "Cheating",
  SPAM: "Spam",
  INAPPROPRIATE_CONTENT: "Inappropriate Content",
  CHALLENGE_ISSUE: "Challenge Issue",
  QUESTION_ERROR: "Question Error",
  OTHER: "Other",
};

export const REPORT_STATUS_OPTIONS: ReportStatus[] = [
  "OPEN",
  "UNDER_REVIEW",
  "RESOLVED",
  "DISMISSED",
];

export const REPORT_PRIORITY_OPTIONS: ReportPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export const REPORT_TYPE_OPTIONS: ReportType[] = [
  "USER_ABUSE",
  "CHEATING",
  "SPAM",
  "INAPPROPRIATE_CONTENT",
  "CHALLENGE_ISSUE",
  "QUESTION_ERROR",
  "OTHER",
];
