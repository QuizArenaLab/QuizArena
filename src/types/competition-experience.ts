/**
 * QuizArena — Competition Experience Domain Types
 *
 * Types for the live execution environment of a competition.
 * Strict separation from legacy 'Challenge' and 'Attempt' types.
 */

import { SessionState } from "@/generated/prisma";

// ─── Question & Option ──────────────────────────────────────────

export interface CompetitionOption {
  id: string;
  text: string;
  displayLabel: string; // "A", "B", "C", "D"
}

export interface CompetitionQuestion {
  questionId: string; // The core original question ID
  question: string;
  options: CompetitionOption[];
  order: number;
}

// ─── Workspace Payload ──────────────────────────────────────────

export interface WorkspaceInitPayload {
  sessionId: string;
  competitionId: string;
  competitionSlug: string;
  competitionTitle: string;
  questions: CompetitionQuestion[];
  initialAnswers: Record<string, string | null>;
  visitedMap: Record<string, boolean>;
  reviewMap: Record<string, boolean>;
  serverExpiresAt: string; // ISO string for server-authoritative timer
  status: SessionState;
}

// ─── Ephemeral State ────────────────────────────────────────────

export type QuestionPaletteState =
  | "CURRENT"
  | "ANSWERED"
  | "REVIEW_MARKED"
  | "VISITED"
  | "UNVISITED";

export interface SyncPayload {
  answers: {
    questionId: string;
    selectedOptionId: string | null;
    isVisited: boolean;
    isMarkedForReview: boolean;
    answeredAt: string; // ISO String
  }[];
}

export type ConnectionStatus = "Connected" | "Saving" | "Offline" | "Synchronizing";

// ─── API Results ────────────────────────────────────────────────

export interface SessionResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface InitializationResult {
  sessionId: string;
  workspacePayload: WorkspaceInitPayload;
}
