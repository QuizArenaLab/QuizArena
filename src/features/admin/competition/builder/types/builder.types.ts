// @ts-nocheck
import {
  ChallengeDifficulty,
  CompetitionStatus,
  CompetitionType,
  ExamCategory,
  QuestionStatus,
} from "@/generated/prisma";

export interface BuilderSection {
  id: string; // sectionId (cuid) or 'default' if no sections
  title: string;
  description: string | null;
  instructions: string | null;
  passingMarks: number | null;
  displayOrder: number;
}

export interface BuilderQuestionConfig {
  marks: number;
  negativeMarks: number;
  isBonus: boolean;
  isMandatory: boolean;
  difficultyOverride: ChallengeDifficulty | null;
  timeLimitOverride: number | null;
}

export interface BuilderQuestion {
  id: string; // This is the CompetitionQuestion.id if it exists, or a temp ID
  questionId: string;
  sectionId: string;
  displayOrder: number;
  config: BuilderQuestionConfig;

  // Denormalized original question data for preview
  original: {
    question: string;
    topic: string | null;
    difficulty: ChallengeDifficulty;
    healthScore: number | null;
    usageCount: number;
  };
}

export interface BuilderMetadata {
  id: string;
  title: string;
  status: CompetitionStatus;
  competitionType: CompetitionType;
  exam: ExamCategory | null;
}

export interface ValidationSummary {
  blockingErrors: string[];
  warnings: string[];
  suggestions: string[];
}

// Partial hydration interface
export interface BuilderHydrationData {
  metadata: BuilderMetadata;
  sections: BuilderSection[];
  questions: BuilderQuestion[]; // Currently loaded questions
}

// State needed for the Zustand store
export interface BuilderState {
  metadata: BuilderMetadata | null;
  sections: Record<string, BuilderSection>;
  questions: Record<string, BuilderQuestion>;
  sectionOrder: string[]; // Ordered list of section IDs

  // Undo/Redo stack handling will use generic snapshots

  // Validation
  validation: ValidationSummary;
  isValidating: boolean;

  // View state
  isPreviewMode: boolean;
  isLeftPanelOpen: boolean;
  leftPanelWidth: number;
  rightPanelWidth: number;

  // Lock State
  hasLock: boolean;
  isReadOnly: boolean;
}
