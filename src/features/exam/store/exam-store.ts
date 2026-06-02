/**
 * QuizArena — Exam State Store (Zustand)
 *
 * Centralized client state for the live exam experience.
 * State is initialized from server-provided ExamInitData.
 * NO persistence middleware — all authoritative state comes from server.
 */

import { create } from "zustand";
import type { ExamQuestion, ExamAnswerState, PaletteState } from "@/types/exam";

// ─── Store Interface ────────────────────────────────────────────

interface ExamStore {
  // ─── Attempt Identity ───────────────────────────────────────
  attemptId: string;
  challengeSlug: string;
  challengeTitle: string;

  // ─── Questions (server-randomized) ──────────────────────────
  questions: ExamQuestion[];

  // ─── Navigation ─────────────────────────────────────────────
  currentIndex: number;
  visitedIndices: number[];

  // ─── Answers ────────────────────────────────────────────────
  answers: ExamAnswerState;

  // ─── Timer ──────────────────────────────────────────────────
  expiresAt: number; // Unix timestamp (ms)

  // ─── Anti-Cheat ─────────────────────────────────────────────
  violationCount: number;
  isFlagged: boolean;

  // ─── UI State ───────────────────────────────────────────────
  isSubmitting: boolean;
  showSubmitModal: boolean;
  showMobilePalette: boolean;

  // ─── Actions ────────────────────────────────────────────────
  initialize: (data: {
    attemptId: string;
    challengeSlug: string;
    challengeTitle: string;
    questions: ExamQuestion[];
    initialAnswers: ExamAnswerState;
    expiresAt: number;
    isFlagged: boolean;
    totalViolations: number;
  }) => void;

  setCurrentIndex: (index: number) => void;
  selectAnswer: (questionId: string, optionId: string) => void;
  markVisited: (index: number) => void;
  incrementViolations: () => void;
  setFlagged: (value: boolean) => void;
  setSubmitting: (value: boolean) => void;
  setShowSubmitModal: (value: boolean) => void;
  setShowMobilePalette: (value: boolean) => void;

  // ─── Computed Helpers ───────────────────────────────────────
  getQuestionPaletteState: (index: number) => PaletteState;
  getAnsweredCount: () => number;
  getUnansweredCount: () => number;
  getNotVisitedCount: () => number;
  getFirstUnansweredIndex: () => number;
}

// ─── Store Implementation ───────────────────────────────────────

export const useExamStore = create<ExamStore>((set, get) => ({
  // Defaults
  attemptId: "",
  challengeSlug: "",
  challengeTitle: "",
  questions: [],
  currentIndex: 0,
  visitedIndices: [0],
  answers: {},
  expiresAt: 0,
  violationCount: 0,
  isFlagged: false,
  isSubmitting: false,
  showSubmitModal: false,
  showMobilePalette: false,

  initialize: (data) => {
    // Recover currentIndex from sessionStorage for refresh recovery
    let recoveredIndex = 0;
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`exam-index-${data.attemptId}`);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < data.questions.length) {
          recoveredIndex = parsed;
        }
      }
    }

    // Build initial visited set from answers + recovered index
    const visitedSet = new Set<number>([recoveredIndex]);
    data.questions.forEach((q, idx) => {
      if (data.initialAnswers[q.questionId]) {
        visitedSet.add(idx);
      }
    });

    set({
      attemptId: data.attemptId,
      challengeSlug: data.challengeSlug,
      challengeTitle: data.challengeTitle,
      questions: data.questions,
      currentIndex: recoveredIndex,
      visitedIndices: Array.from(visitedSet),
      answers: data.initialAnswers,
      expiresAt: data.expiresAt,
      isFlagged: data.isFlagged,
      violationCount: data.totalViolations,
      isSubmitting: false,
      showSubmitModal: false,
      showMobilePalette: false,
    });
  },

  setCurrentIndex: (index) => {
    const state = get();
    if (index < 0 || index >= state.questions.length) return;

    // Persist to sessionStorage for refresh recovery
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`exam-index-${state.attemptId}`, String(index));
    }

    const newVisited = state.visitedIndices.includes(index)
      ? state.visitedIndices
      : [...state.visitedIndices, index];

    set({ currentIndex: index, visitedIndices: newVisited });
  },

  selectAnswer: (questionId, optionId) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: optionId },
    }));
  },

  markVisited: (index) => {
    set((state) => {
      if (state.visitedIndices.includes(index)) return state;
      return { visitedIndices: [...state.visitedIndices, index] };
    });
  },

  incrementViolations: () => {
    set((state) => {
      const newCount = state.violationCount + 1;
      return {
        violationCount: newCount,
        isFlagged: newCount >= 10 ? true : state.isFlagged,
      };
    });
  },

  setFlagged: (value) => set({ isFlagged: value }),
  setSubmitting: (value) => set({ isSubmitting: value }),
  setShowSubmitModal: (value) => set({ showSubmitModal: value }),
  setShowMobilePalette: (value) => set({ showMobilePalette: value }),

  // ─── Computed Helpers ─────────────────────────────────────────

  getQuestionPaletteState: (index) => {
    const state = get();
    if (index === state.currentIndex) return "CURRENT";

    const questionId = state.questions[index]?.questionId;
    if (questionId && state.answers[questionId]) return "ANSWERED";

    if (state.visitedIndices.includes(index)) return "UNANSWERED";

    return "NOT_VISITED";
  },

  getAnsweredCount: () => {
    const state = get();
    return Object.values(state.answers).filter(Boolean).length;
  },

  getUnansweredCount: () => {
    const state = get();
    const answered = Object.values(state.answers).filter(Boolean).length;
    return state.questions.length - answered;
  },

  getNotVisitedCount: () => {
    const state = get();
    return state.questions.length - state.visitedIndices.length;
  },

  getFirstUnansweredIndex: () => {
    const state = get();
    for (let i = 0; i < state.questions.length; i++) {
      const qId = state.questions[i].questionId;
      if (!state.answers[qId]) return i;
    }
    return 0;
  },
}));
