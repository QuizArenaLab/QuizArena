import { CompetitionWithRelations } from "../../../types";
import { ReadinessScore, ValidationReport } from "../../validation/types/validation.types";
import { CompetitionVersionInfo } from "../../versioning/types/versioning.types";
import { AuditEntry } from "../../audit/types/audit.types";
import { CompetitionScheduleInfo } from "../../scheduling/types/scheduling.types";

export interface PublishingConfig {
  mode: "IMMEDIATE" | "SCHEDULED";
  scheduledDate?: string;
  expiryDate?: string;
  timezone: string;
  changelog: string;
}

export interface PublishWorkspaceData {
  competition: CompetitionWithRelations;
  validationReport: ValidationReport;
  readinessScore: ReadinessScore;
  checklist: ChecklistItem[];
  versions: CompetitionVersionInfo[];
  auditTrail: AuditEntry[];
  schedule: CompetitionScheduleInfo | null;
  publishingLock: PublishingLockInfo | null;
}

export type ChecklistCategory =
  | "COMPETITION_INFO"
  | "QUESTIONS"
  | "SECTIONS"
  | "SCHEDULING"
  | "ELIGIBILITY"
  | "RULES"
  | "QUALITY"
  | "PERMISSIONS";

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  label: string;
  status: "complete" | "warning" | "failed";
  deepLink?: string; // Route to fix the issue
  failedItems?: string[]; // Specific IDs/codes
}

export interface PublishingLockInfo {
  userId: string;
  userName?: string;
  acquiredAt: string;
  expiresAt: string;
}
