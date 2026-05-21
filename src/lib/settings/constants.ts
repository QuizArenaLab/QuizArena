/**
 * QuizArena — Platform Settings Constants
 *
 * Defines all default platform settings with their keys, categories,
 * descriptions, default values, and protection levels.
 *
 * This is the single source of truth for what settings exist.
 */

import { SETTING_CATEGORIES, type SettingDefinition } from "./types";

// ─── Setting Keys ───────────────────────────────────────────
export const SETTING_KEYS = {
  // General
  PLATFORM_NAME: "platform.name",
  PLATFORM_DESCRIPTION: "platform.description",
  PLATFORM_LOGO_URL: "platform.logo_url",

  // Challenges
  CHALLENGES_SUBMISSIONS_ENABLED: "challenges.submissions_enabled",
  CHALLENGES_AUTO_PUBLISH: "challenges.auto_publish",
  CHALLENGES_MAX_DURATION_MINUTES: "challenges.max_duration_minutes",
  CHALLENGES_MAX_QUESTIONS: "challenges.max_questions",
  CHALLENGES_NEGATIVE_MARKING_ENABLED: "challenges.negative_marking_enabled",

  // Moderation
  MODERATION_ENABLED: "moderation.enabled",
  MODERATION_AUTO_FLAG_ENABLED: "moderation.auto_flag_enabled",
  MODERATION_REQUIRE_REVIEW: "moderation.require_review",
  MODERATION_MAX_REPORTS_BEFORE_FLAG: "moderation.max_reports_before_flag",

  // Auth
  AUTH_REGISTRATION_ENABLED: "auth.registration_enabled",
  AUTH_GOOGLE_OAUTH_ENABLED: "auth.google_oauth_enabled",
  AUTH_MAX_LOGIN_ATTEMPTS: "auth.max_login_attempts",
  AUTH_ONBOARDING_REQUIRED: "auth.onboarding_required",

  // Analytics
  ANALYTICS_TRACKING_ENABLED: "analytics.tracking_enabled",
  ANALYTICS_DAILY_AGGREGATION_ENABLED: "analytics.daily_aggregation_enabled",
  ANALYTICS_LEADERBOARD_VISIBLE: "analytics.leaderboard_visible",

  // System (Protected — SUPER_ADMIN only)
  SYSTEM_MAINTENANCE_MODE: "system.maintenance_mode",
  SYSTEM_MAINTENANCE_MESSAGE: "system.maintenance_message",
  SYSTEM_DEBUG_MODE: "system.debug_mode",
  SYSTEM_MAX_CONCURRENT_USERS: "system.max_concurrent_users",
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

// ─── Default Settings Definitions ───────────────────────────
export const DEFAULT_SETTINGS: SettingDefinition[] = [
  // ── General ──────────────────────────────────────────
  {
    key: SETTING_KEYS.PLATFORM_NAME,
    defaultValue: "QuizArena",
    category: SETTING_CATEGORIES.GENERAL,
    description: "The display name of the platform shown across the UI",
    isProtected: false,
    valueType: "string",
  },
  {
    key: SETTING_KEYS.PLATFORM_DESCRIPTION,
    defaultValue: "AI-powered quiz platform for competitive exam preparation",
    category: SETTING_CATEGORIES.GENERAL,
    description: "Platform description used in SEO and marketing",
    isProtected: false,
    valueType: "string",
  },
  {
    key: SETTING_KEYS.PLATFORM_LOGO_URL,
    defaultValue: "/logo.png",
    category: SETTING_CATEGORIES.GENERAL,
    description: "URL path to the platform logo",
    isProtected: false,
    valueType: "string",
  },

  // ── Challenges ───────────────────────────────────────
  {
    key: SETTING_KEYS.CHALLENGES_SUBMISSIONS_ENABLED,
    defaultValue: true,
    category: SETTING_CATEGORIES.CHALLENGES,
    description:
      "Allow users to submit challenge attempts. Disabling pauses all challenge participation.",
    isProtected: false,
    valueType: "boolean",
  },
  {
    key: SETTING_KEYS.CHALLENGES_AUTO_PUBLISH,
    defaultValue: false,
    category: SETTING_CATEGORIES.CHALLENGES,
    description: "Automatically publish approved challenges without manual intervention",
    isProtected: false,
    valueType: "boolean",
  },
  {
    key: SETTING_KEYS.CHALLENGES_MAX_DURATION_MINUTES,
    defaultValue: 180,
    category: SETTING_CATEGORIES.CHALLENGES,
    description: "Maximum allowed duration for a single challenge in minutes",
    isProtected: false,
    valueType: "number",
  },
  {
    key: SETTING_KEYS.CHALLENGES_MAX_QUESTIONS,
    defaultValue: 100,
    category: SETTING_CATEGORIES.CHALLENGES,
    description: "Maximum number of questions allowed per challenge",
    isProtected: false,
    valueType: "number",
  },
  {
    key: SETTING_KEYS.CHALLENGES_NEGATIVE_MARKING_ENABLED,
    defaultValue: true,
    category: SETTING_CATEGORIES.CHALLENGES,
    description: "Enable negative marking support for challenges",
    isProtected: false,
    valueType: "boolean",
  },

  // ── Moderation ───────────────────────────────────────
  {
    key: SETTING_KEYS.MODERATION_ENABLED,
    defaultValue: true,
    category: SETTING_CATEGORIES.MODERATION,
    description:
      "Enable the content moderation system. Disabling bypasses all moderation workflows.",
    isProtected: false,
    valueType: "boolean",
  },
  {
    key: SETTING_KEYS.MODERATION_AUTO_FLAG_ENABLED,
    defaultValue: true,
    category: SETTING_CATEGORIES.MODERATION,
    description: "Automatically flag content based on report thresholds",
    isProtected: false,
    valueType: "boolean",
  },
  {
    key: SETTING_KEYS.MODERATION_REQUIRE_REVIEW,
    defaultValue: true,
    category: SETTING_CATEGORIES.MODERATION,
    description: "Require moderator review before content is published",
    isProtected: false,
    valueType: "boolean",
  },
  {
    key: SETTING_KEYS.MODERATION_MAX_REPORTS_BEFORE_FLAG,
    defaultValue: 3,
    category: SETTING_CATEGORIES.MODERATION,
    description: "Number of reports required before content is auto-flagged",
    isProtected: false,
    valueType: "number",
  },

  // ── Auth ─────────────────────────────────────────────
  {
    key: SETTING_KEYS.AUTH_REGISTRATION_ENABLED,
    defaultValue: true,
    category: SETTING_CATEGORIES.AUTH,
    description: "Allow new user registrations. Disabling prevents all signups.",
    isProtected: false,
    valueType: "boolean",
  },
  {
    key: SETTING_KEYS.AUTH_GOOGLE_OAUTH_ENABLED,
    defaultValue: true,
    category: SETTING_CATEGORIES.AUTH,
    description: "Enable Google OAuth login/registration",
    isProtected: false,
    valueType: "boolean",
  },
  {
    key: SETTING_KEYS.AUTH_MAX_LOGIN_ATTEMPTS,
    defaultValue: 5,
    category: SETTING_CATEGORIES.AUTH,
    description: "Maximum failed login attempts before temporary lockout",
    isProtected: false,
    valueType: "number",
  },
  {
    key: SETTING_KEYS.AUTH_ONBOARDING_REQUIRED,
    defaultValue: true,
    category: SETTING_CATEGORIES.AUTH,
    description: "Require new users to complete the onboarding flow",
    isProtected: false,
    valueType: "boolean",
  },

  // ── Analytics ────────────────────────────────────────
  {
    key: SETTING_KEYS.ANALYTICS_TRACKING_ENABLED,
    defaultValue: true,
    category: SETTING_CATEGORIES.ANALYTICS,
    description: "Enable platform analytics tracking and data collection",
    isProtected: false,
    valueType: "boolean",
  },
  {
    key: SETTING_KEYS.ANALYTICS_DAILY_AGGREGATION_ENABLED,
    defaultValue: true,
    category: SETTING_CATEGORIES.ANALYTICS,
    description: "Enable daily analytics aggregation for performance metrics",
    isProtected: false,
    valueType: "boolean",
  },
  {
    key: SETTING_KEYS.ANALYTICS_LEADERBOARD_VISIBLE,
    defaultValue: true,
    category: SETTING_CATEGORIES.ANALYTICS,
    description: "Show leaderboard rankings to all users",
    isProtected: false,
    valueType: "boolean",
  },

  // ── System (Protected) ──────────────────────────────
  {
    key: SETTING_KEYS.SYSTEM_MAINTENANCE_MODE,
    defaultValue: false,
    category: SETTING_CATEGORIES.SYSTEM,
    description:
      "Enable maintenance mode. When active, only admins can access the platform. All users see a maintenance page.",
    isProtected: true,
    valueType: "boolean",
  },
  {
    key: SETTING_KEYS.SYSTEM_MAINTENANCE_MESSAGE,
    defaultValue: "QuizArena is currently undergoing scheduled maintenance. We'll be back shortly.",
    category: SETTING_CATEGORIES.SYSTEM,
    description: "Message displayed to users during maintenance mode",
    isProtected: true,
    valueType: "string",
  },
  {
    key: SETTING_KEYS.SYSTEM_DEBUG_MODE,
    defaultValue: false,
    category: SETTING_CATEGORIES.SYSTEM,
    description:
      "Enable debug mode for enhanced logging and diagnostics. Should be disabled in production.",
    isProtected: true,
    valueType: "boolean",
  },
  {
    key: SETTING_KEYS.SYSTEM_MAX_CONCURRENT_USERS,
    defaultValue: 10000,
    category: SETTING_CATEGORIES.SYSTEM,
    description: "Maximum concurrent user sessions allowed on the platform",
    isProtected: true,
    valueType: "number",
  },
];

// ─── Dangerous Settings (require confirmation) ──────────────
export const DANGEROUS_SETTING_KEYS: string[] = [
  SETTING_KEYS.AUTH_REGISTRATION_ENABLED,
  SETTING_KEYS.SYSTEM_MAINTENANCE_MODE,
  SETTING_KEYS.MODERATION_ENABLED,
  SETTING_KEYS.CHALLENGES_SUBMISSIONS_ENABLED,
  SETTING_KEYS.SYSTEM_DEBUG_MODE,
];

/**
 * Check if a setting change requires explicit confirmation
 */
export function isDangerousSetting(key: string): boolean {
  return DANGEROUS_SETTING_KEYS.includes(key);
}

/**
 * Get setting definition by key
 */
export function getSettingDefinition(key: string): SettingDefinition | undefined {
  return DEFAULT_SETTINGS.find((s) => s.key === key);
}

/**
 * Get setting value type by key
 */
export function getSettingValueType(key: string): SettingDefinition["valueType"] {
  return getSettingDefinition(key)?.valueType ?? "string";
}
