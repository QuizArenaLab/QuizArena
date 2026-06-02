"use client";

/**
 * QuizArena — Exam Navigation Hook
 *
 * Manages question navigation, visited tracking, and palette state.
 * Reads/writes to the Zustand exam store.
 */

import { useCallback } from "react";
import { useExamStore } from "@/features/exam/store/exam-store";
import type { PaletteState } from "@/types/exam";

interface UseExamNavigationReturn {
  currentIndex: number;
  totalQuestions: number;
  isFirst: boolean;
  isLast: boolean;
  goNext: () => void;
  goPrevious: () => void;
  goTo: (index: number) => void;
  getPaletteState: (index: number) => PaletteState;
  answeredCount: number;
  unansweredCount: number;
  notVisitedCount: number;
  firstUnansweredIndex: number;
}

export function useExamNavigation(): UseExamNavigationReturn {
  const currentIndex = useExamStore((s) => s.currentIndex);
  const questions = useExamStore((s) => s.questions);
  const setCurrentIndex = useExamStore((s) => s.setCurrentIndex);
  const getQuestionPaletteState = useExamStore((s) => s.getQuestionPaletteState);
  const getAnsweredCount = useExamStore((s) => s.getAnsweredCount);
  const getUnansweredCount = useExamStore((s) => s.getUnansweredCount);
  const getNotVisitedCount = useExamStore((s) => s.getNotVisitedCount);
  const getFirstUnansweredIndex = useExamStore((s) => s.getFirstUnansweredIndex);

  const totalQuestions = questions.length;

  const goNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, totalQuestions, setCurrentIndex]);

  const goPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, setCurrentIndex]);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalQuestions) {
        setCurrentIndex(index);
      }
    },
    [totalQuestions, setCurrentIndex]
  );

  const getPaletteState = useCallback(
    (index: number): PaletteState => {
      return getQuestionPaletteState(index);
    },
    [getQuestionPaletteState]
  );

  return {
    currentIndex,
    totalQuestions,
    isFirst: currentIndex === 0,
    isLast: currentIndex === totalQuestions - 1,
    goNext,
    goPrevious,
    goTo,
    getPaletteState,
    answeredCount: getAnsweredCount(),
    unansweredCount: getUnansweredCount(),
    notVisitedCount: getNotVisitedCount(),
    firstUnansweredIndex: getFirstUnansweredIndex(),
  };
}
