"use client";

/**
 * QuizArena — Answer Persistence Hook
 *
 * Optimistic UI updates with debounced server saves.
 * Offline queue with flush on reconnect.
 * Retry logic with exponential backoff.
 */

import { useCallback, useRef, useEffect, useState } from "react";
import { useExamStore } from "@/features/exam/store/exam-store";
import { saveAnswer as serverSaveAnswer } from "@/features/challenges/services/challenge";
import type { SaveStatus } from "@/types/exam";

interface SaveQueueItem {
  questionId: string;
  optionId: string;
  retryCount: number;
}

interface UseAnswerPersistenceReturn {
  answers: Record<string, string | null>;
  selectAnswer: (questionId: string, optionId: string) => void;
  saveStatus: SaveStatus;
  pendingCount: number;
}

const MAX_RETRIES = 3;
const DEBOUNCE_MS = 300;

export function useAnswerPersistence(): UseAnswerPersistenceReturn {
  const attemptId = useExamStore((s) => s.attemptId);
  const answers = useExamStore((s) => s.answers);
  const storeSelectAnswer = useExamStore((s) => s.selectAnswer);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [pendingCount, setPendingCount] = useState(0);

  const saveQueueRef = useRef<SaveQueueItem[]>([]);
  const debounceTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const isSavingRef = useRef(false);
  const attemptIdRef = useRef(attemptId);

  useEffect(() => {
    attemptIdRef.current = attemptId;
  }, [attemptId]);

  // Use a ref for the processQueue function to avoid self-reference issues
  const processQueueRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    const processQueue = async () => {
      if (isSavingRef.current || saveQueueRef.current.length === 0 || !attemptIdRef.current) return;

      isSavingRef.current = true;
      setSaveStatus("saving");

      const item = saveQueueRef.current.shift();
      if (!item) {
        isSavingRef.current = false;
        setSaveStatus("idle");
        return;
      }

      try {
        const result = await serverSaveAnswer(attemptIdRef.current, item.questionId, item.optionId);

        if (!result.success) {
          console.warn("Save rejected:", result.error);
        }

        setSaveStatus("saved");
        setPendingCount(saveQueueRef.current.length);

        // Reset status after brief display
        setTimeout(() => {
          if (saveQueueRef.current.length === 0) {
            setSaveStatus("idle");
          }
        }, 1000);
      } catch {
        // Network error — retry
        if (item.retryCount < MAX_RETRIES) {
          saveQueueRef.current.unshift({
            ...item,
            retryCount: item.retryCount + 1,
          });

          // Exponential backoff
          const delay = Math.pow(2, item.retryCount) * 1000;
          setTimeout(() => {
            isSavingRef.current = false;
            processQueueRef.current();
          }, delay);
          return;
        } else {
          setSaveStatus("error");
          console.error("Failed to save answer after retries:", item.questionId);
        }
      }

      isSavingRef.current = false;
      setPendingCount(saveQueueRef.current.length);

      // Process next item if any
      if (saveQueueRef.current.length > 0) {
        processQueueRef.current();
      }
    };

    processQueueRef.current = processQueue;
  }, []);

  // Online handler — flush queue on reconnect
  useEffect(() => {
    const handleOnline = () => {
      if (saveQueueRef.current.length > 0) {
        processQueueRef.current();
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const selectAnswer = useCallback(
    (questionId: string, optionId: string) => {
      // 1. Optimistic UI update (instant)
      storeSelectAnswer(questionId, optionId);

      // 2. Debounce server save to handle rapid re-selection
      const timers = debounceTimersRef.current;
      if (timers[questionId]) {
        clearTimeout(timers[questionId]);
      }

      timers[questionId] = setTimeout(() => {
        // Remove any existing queue entry for this question (superseded)
        saveQueueRef.current = saveQueueRef.current.filter(
          (item) => item.questionId !== questionId
        );

        saveQueueRef.current.push({
          questionId,
          optionId,
          retryCount: 0,
        });

        setPendingCount(saveQueueRef.current.length);
        processQueueRef.current();
      }, DEBOUNCE_MS);
    },
    [storeSelectAnswer]
  );

  // Cleanup debounce timers
  useEffect(() => {
    const timers = debounceTimersRef.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  return {
    answers,
    selectAnswer,
    saveStatus,
    pendingCount,
  };
}
