import type { Challenge, Question, Attempt, AttemptAnswer } from "@/generated/prisma";

// ─── Enums ─────────────────────────────────────────────────────

export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "EVALUATED" | "ABANDONED";
export type ViolationType = "TAB_SWITCH" | "WINDOW_BLUR" | "COPY_ATTEMPT" | "RIGHT_CLICK";
export type ChallengeLifecycleStatus = "DRAFT" | "SCHEDULED" | "LIVE" | "ENDED" | "ARCHIVED";
export type ChallengeDifficultyLevel = "BEGINNER" | "MEDIUM" | "HARDCORE";

// ─── Challenge Types ───────────────────────────────────────────

export type ChallengeWithQuestions = Challenge & {
  questions: (ChallengeQuestionWithQuestion & { question: Question })[];
};

export type ChallengeQuestionWithQuestion = {
  id: string;
  challengeId: string;
  questionId: string;
  order: number;
  question: Question;
};

export type ChallengeQuestionWithAnswer = {
  id: string;
  questionId: string;
  question: string;
  options: ShuffledOption[];
  order: number;
};

export type ShuffledOption = {
  id: string;
  text: string;
  displayLabel: string; // "A", "B", "C", "D"
};

export type ChallengeWithQuestionsForAttempt = Challenge & {
  questions: ChallengeQuestionWithAnswer[];
};

// ─── Attempt Types ─────────────────────────────────────────────

export type AttemptWithDetails = Attempt & {
  challenge: Challenge;
  answers: AttemptAnswer[];
};

export interface AnswerSubmission {
  questionId: string;
  selectedOptionId: string | null;
  selectedOptionText: string | null;
}

export interface ChallengeStartResult {
  success: boolean;
  attemptId?: string;
  challenge?: ChallengeWithQuestionsForAttempt;
  existingAttempt?: Attempt;
  error?: string;
}

export interface ChallengeSubmitResult {
  success: boolean;
  attempt?: AttemptWithDetails;
  error?: string;
}

// ─── Result Types ──────────────────────────────────────────────

export interface QuestionResult {
  questionId: string;
  selectedOption: string | null;
  correctOption: string;
  isCorrect: boolean;
}

export interface ChallengeResult {
  attemptId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  accuracy: number;
  timeTaken: number;
  questions: QuestionResult[];
}

// ─── Quiz State Types ──────────────────────────────────────────

export type QuizAnswerState = Record<string, string | null>;

export interface TimerState {
  remainingSeconds: number;
  startedAt: Date;
  expiresAt: Date;
}

// ─── Anti-Cheat Types ──────────────────────────────────────────

export interface ViolationReport {
  type: ViolationType;
  count: number;
  timestamps: number[];
}

export interface AntiCheatState {
  violations: Record<ViolationType, number>;
  totalViolations: number;
  warningShown: boolean;
  criticalWarningShown: boolean;
}

// ─── Leaderboard Types ─────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string | null;
  name: string | null;
  image: string | null;
  score: number;
  accuracy: number;
  timeTakenInSeconds: number;
  frozenAt: Date;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalParticipants: number;
  challengeId: string;
  challengeTitle: string;
  userRank?: number;
  isFrozen: boolean;
}
