"use client";

/**
 * QuizArena — Exam Timer Hook
 *
 * Countdown timer driven by server-authoritative expiresAt timestamp.
 * Uses setInterval with drift correction for accuracy.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { TimerUrgency } from "@/types/exam";

interface UseExamTimerProps {
  expiresAt: number; // Unix timestamp in ms
  onExpire: () => void;
  enabled?: boolean;
}

interface UseExamTimerReturn {
  remainingSeconds: number;
  isExpired: boolean;
  urgency: TimerUrgency;
  formatted: string;
}

const WARNING_THRESHOLD = 300; // 5 minutes
const DANGER_THRESHOLD = 60; // 1 minute

function formatTime(totalSeconds: number): string {
  if (totalSeconds <= 0) return "00:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  if (hours > 0) {
    const hh = String(hours).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }

  return `${mm}:${ss}`;
}

function getUrgency(seconds: number): TimerUrgency {
  if (seconds <= DANGER_THRESHOLD) return "danger";
  if (seconds <= WARNING_THRESHOLD) return "warning";
  return "normal";
}

export function useExamTimer({
  expiresAt,
  onExpire,
  enabled = true,
}: UseExamTimerProps): UseExamTimerReturn {
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const now = Date.now();
    return Math.max(0, Math.floor((expiresAt - now) / 1000));
  });

  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const calculateRemaining = useCallback(() => {
    const now = Date.now();
    return Math.max(0, Math.floor((expiresAt - now) / 1000));
  }, [expiresAt]);

  useEffect(() => {
    if (!enabled || expiredRef.current) return;

    // Initial sync
    const initial = calculateRemaining();
    setRemainingSeconds(initial);

    if (initial <= 0) {
      expiredRef.current = true;
      onExpireRef.current();
      return;
    }

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setRemainingSeconds(remaining);

      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(interval);
        onExpireRef.current();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, enabled, calculateRemaining]);

  const isExpired = remainingSeconds <= 0;
  const urgency = getUrgency(remainingSeconds);
  const formatted = formatTime(remainingSeconds);

  return { remainingSeconds, isExpired, urgency, formatted };
}
