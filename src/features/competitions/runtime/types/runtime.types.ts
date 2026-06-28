import type { CompetitionQuestion, WorkspaceInitPayload } from "@/types/competition-experience";

export type RuntimeStatus =
  | "CREATING"
  | "BOOTING"
  | "INITIALIZING"
  | "RESTORING_SESSION"
  | "READY"
  | "RUNNING"
  | "SYNCING"
  | "SUBMITTING"
  | "SUBMITTED"
  | "EXPIRED"
  | "ERROR"
  | "DESTROYING"
  | "DESTROYED";

export type ConnectionStatus = "Connected" | "Saving" | "Offline" | "Synchronizing";
export type QuestionPaletteState =
  | "CURRENT"
  | "ANSWERED"
  | "REVIEW_MARKED"
  | "VISITED"
  | "UNVISITED";

/**
 * Immutable Snapshot of the Runtime State
 * UI components read this state but cannot modify it directly.
 */
export interface RuntimeState {
  // Global Status
  status: RuntimeStatus;

  // Identity & Data
  sessionId: string;
  competitionId: string;
  competitionTitle: string;
  competitionSlug: string;
  questions: CompetitionQuestion[];

  // Timing
  serverExpiresAt: string;
  remainingSeconds: number;

  // Navigation
  currentIndex: number;
  totalQuestions: number;

  // Answers & Flags
  answers: Record<string, string | null>;
  visitedMap: Record<string, boolean>;
  reviewMap: Record<string, boolean>;

  // Networking
  connectionStatus: ConnectionStatus;
  mutationQueueSize: number;

  // Diagnostics
  initializedAt: number | null;
  lastSyncAt: number | null;
  recoveryCount: number;

  // UI Helpers
  showMobilePalette: boolean;
}

/**
 * Event Bus Types
 */
export interface RuntimeEvent {
  eventId: string;
  eventType: string;
  sessionId: string;
  timestamp: number;
  runtimeVersion: string;
  payload: any;
}

/**
 * Command Bus Types
 */
export interface RuntimeCommand {
  commandType: string;
  payload?: any;
}
