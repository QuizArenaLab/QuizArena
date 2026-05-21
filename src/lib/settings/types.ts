/**
 * QuizArena — Platform Settings Type Definitions
 *
 * Centralized types for the platform configuration system.
 * Used across settings utilities, server actions, and UI components.
 */

import type { JsonValue } from "@/generated/prisma/runtime/library";

// ─── Setting Categories ─────────────────────────────────────
export const SETTING_CATEGORIES = {
  GENERAL: "general",
  CHALLENGES: "challenges",
  MODERATION: "moderation",
  AUTH: "auth",
  ANALYTICS: "analytics",
  SYSTEM: "system",
} as const;

export type SettingCategory = (typeof SETTING_CATEGORIES)[keyof typeof SETTING_CATEGORIES];

export const CATEGORY_LABELS: Record<SettingCategory, string> = {
  general: "General",
  challenges: "Challenges",
  moderation: "Moderation",
  auth: "Authentication",
  analytics: "Analytics",
  system: "System",
};

export const CATEGORY_DESCRIPTIONS: Record<SettingCategory, string> = {
  general: "Platform identity and general configuration",
  challenges: "Challenge system operations and controls",
  moderation: "Content moderation and review controls",
  auth: "Authentication and registration controls",
  analytics: "Analytics tracking and aggregation",
  system: "Infrastructure-sensitive system controls",
};

// ─── Setting Definition ─────────────────────────────────────
export interface SettingDefinition {
  key: string;
  defaultValue: JsonValue;
  category: SettingCategory;
  description: string;
  isProtected: boolean;
  valueType: "boolean" | "string" | "number" | "json";
}

// ─── Setting Display ────────────────────────────────────────
export interface SettingDisplay {
  id: string;
  key: string;
  value: JsonValue;
  category: string;
  description: string | null;
  isProtected: boolean;
  updatedAt: Date;
  updatedBy: {
    id: string;
    name: string | null;
  } | null;
}

// ─── Setting Update Input ───────────────────────────────────
export interface SettingUpdateInput {
  key: string;
  value: JsonValue;
  reason?: string;
}

// ─── Setting Audit Entry ────────────────────────────────────
export interface SettingAuditEntry {
  id: string;
  settingKey: string;
  previousValue: JsonValue | null;
  newValue: JsonValue;
  reason: string | null;
  changedBy: {
    id: string;
    name: string | null;
  };
  changedAt: Date;
}

// ─── Dashboard Data ─────────────────────────────────────────
export interface SettingsDashboardData {
  settings: Record<SettingCategory, SettingDisplay[]>;
  totalSettings: number;
  recentAudits: SettingAuditEntry[];
}

// ─── Action Results ─────────────────────────────────────────
export interface SettingActionResult {
  success: boolean;
  error?: string;
}
