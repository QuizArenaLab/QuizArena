export type ValidationCategory =
  | "CONFIGURATION"
  | "STRUCTURE"
  | "QUESTION_QUALITY"
  | "RULES"
  | "SCHEDULING"
  | "BUSINESS";

export type ValidationSeverity = "error" | "warning" | "recommendation";

export interface ValidationItem {
  id: string; // Unique within report
  category: ValidationCategory;
  severity: ValidationSeverity;
  code: string; // Stable code: "CONF001", "RULE004"
  title: string;
  description: string;
  affectedEntity?: {
    type: "question" | "section" | "config" | "schedule" | "economics";
    id: string;
    label?: string;
  };
  fixSuggestion?: string;
}

export interface ValidationReport {
  competitionId: string;
  items: ValidationItem[];
  counts: Record<ValidationSeverity, number>;
  byCategory: Record<ValidationCategory, ValidationItem[]>;
  generatedAt: string; // ISO timestamp
  cacheHash: string; // For cache invalidation
}

export type ReadinessLevel = "READY" | "NEARLY_READY" | "NEEDS_ATTENTION" | "BLOCKED";

export interface ReadinessScore {
  score: number; // 0–100
  level: ReadinessLevel;
  categoryScores: Record<ValidationCategory, { score: number; weight: number }>;
}

// Centralized category weights
export const VALIDATION_CATEGORY_WEIGHTS: Record<ValidationCategory, number> = {
  CONFIGURATION: 20,
  STRUCTURE: 25,
  QUESTION_QUALITY: 30,
  SCHEDULING: 10,
  RULES: 0, // Included in CONFIGURATION weight conceptually, or we can distribute
  BUSINESS: 15,
};
