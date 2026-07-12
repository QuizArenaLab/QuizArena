export type QuestionVisibilityLevel = "public" | "private" | "organization" | "unlisted";

export interface QuestionVisibility {
  level: QuestionVisibilityLevel;
  organizationId?: string;
}
