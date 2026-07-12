export type QuestionDifficultyLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface QuestionDifficulty {
  level: QuestionDifficultyLevel;
  score: number; // e.g. 1-100 or ELO representation
}
