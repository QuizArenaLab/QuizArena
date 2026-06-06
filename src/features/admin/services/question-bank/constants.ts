/**
 * QuizArena — Question Bank Constants
 *
 * Canonical constants for question governance, categorization,
 * and display metadata. Single source of truth for all
 * question-related taxonomies and configurations.
 */

// ─── Category Taxonomy ──────────────────────────────────────────────────────

export const QUESTION_CATEGORIES = [
  "Quantitative Aptitude",
  "Reasoning Ability",
  "English Language",
  "General Awareness",
  "General Science",
  "Computer Knowledge",
  "Current Affairs",
  "Data Interpretation",
  "Banking Awareness",
  "Economy & Finance",
  "History",
  "Geography",
  "Polity & Constitution",
  "Science & Technology",
] as const;

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

/**
 * Category abbreviation map for deterministic question code generation.
 * Each category maps to a 3-5 character uppercase abbreviation.
 */
export const CATEGORY_ABBREVIATION_MAP: Record<string, string> = {
  "Quantitative Aptitude": "QUANT",
  "Reasoning Ability": "REAS",
  "English Language": "ENG",
  "General Awareness": "GA",
  "General Science": "SCI",
  "Computer Knowledge": "COMP",
  "Current Affairs": "CA",
  "Data Interpretation": "DI",
  "Banking Awareness": "BANK",
  "Economy & Finance": "ECON",
  History: "HIST",
  Geography: "GEO",
  "Polity & Constitution": "POLITY",
  "Science & Technology": "STECH",
};

// ─── Subject Taxonomy ───────────────────────────────────────────────────────

export const COMMON_SUBJECTS = [
  "Quantitative Aptitude",
  "Reasoning Ability",
  "English Language",
  "General Awareness",
  "General Science",
  "Computer Knowledge",
  "Current Affairs",
] as const;

// ─── Difficulty Metadata ────────────────────────────────────────────────────

export const DIFFICULTY_CONFIG = {
  BEGINNER: {
    label: "Beginner",
    color: "#10B981",
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    icon: "🟢",
  },
  MEDIUM: {
    label: "Medium",
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A",
    icon: "🟡",
  },
  HARDCORE: {
    label: "Hardcore",
    color: "#EF4444",
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
    icon: "🔴",
  },
} as const;

export type DifficultyKey = keyof typeof DIFFICULTY_CONFIG;

// ─── Status Display Metadata ────────────────────────────────────────────────

export const STATUS_CONFIG = {
  DRAFT: {
    label: "Draft",
    color: "#6B7280",
    bgColor: "#F3F4F6",
    borderColor: "#D1D5DB",
    icon: "📝",
    description: "Question is being drafted",
  },
  REVIEW: {
    label: "In Review",
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
    borderColor: "#C4B5FD",
    icon: "👁️",
    description: "Awaiting admin review",
  },
  APPROVED: {
    label: "Approved",
    color: "#059669",
    bgColor: "#ECFDF5",
    borderColor: "#6EE7B7",
    icon: "✅",
    description: "Approved for challenge inclusion",
  },
  REJECTED: {
    label: "Rejected",
    color: "#DC2626",
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
    icon: "❌",
    description: "Rejected during review",
  },
  ARCHIVED: {
    label: "Archived",
    color: "#64748B",
    bgColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    icon: "📦",
    description: "Archived from active use",
  },
  FLAGGED: {
    label: "Flagged",
    color: "#EA580C",
    bgColor: "#FFF7ED",
    borderColor: "#FDBA74",
    icon: "🚩",
    description: "Flagged for quality concern",
  },
} as const;

export type QuestionStatusKey = keyof typeof STATUS_CONFIG;

// ─── Tag Presets ────────────────────────────────────────────────────────────

export const TAG_PRESETS = [
  "SSC CGL",
  "SSC CHSL",
  "IBPS PO",
  "IBPS Clerk",
  "SBI PO",
  "SBI Clerk",
  "RBI Grade B",
  "Railways RRB",
  "State PSC",
  "UPSC",
  "Previous Year",
  "High Frequency",
  "Conceptual",
  "Calculation Heavy",
  "Tricky",
  "Easy Scorer",
] as const;

// ─── Language Options ───────────────────────────────────────────────────────

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "kn", label: "Kannada" },
  { value: "ml", label: "Malayalam" },
  { value: "bn", label: "Bengali" },
  { value: "mr", label: "Marathi" },
  { value: "gu", label: "Gujarati" },
] as const;

// ─── Question Code Configuration ────────────────────────────────────────────

export const QUESTION_CODE_PREFIX = "QA";
export const QUESTION_CODE_SEPARATOR = "-";
export const QUESTION_CODE_PAD_LENGTH = 6;

// ─── Governance Constants ───────────────────────────────────────────────────

export const MIN_OPTIONS = 4;
export const MAX_OPTIONS = 6;
export const MIN_QUESTION_LENGTH = 10;
export const MAX_QUESTION_LENGTH = 2000;
export const MAX_EXPLANATION_LENGTH = 3000;
export const MAX_OPTION_LENGTH = 500;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
