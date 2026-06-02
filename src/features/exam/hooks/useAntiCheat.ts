"use client";

/**
 * QuizArena — Enhanced Anti-Cheat Hook
 *
 * Implements client-side anti-cheat detection for:
 * - Tab switch (visibilitychange)
 * - Window blur
 * - Right-click blocking (contextmenu)
 * - Copy/cut blocking
 * - Keyboard shortcut blocking (Ctrl+C, Ctrl+A, Ctrl+U, F12)
 * - Text selection blocking (selectstart)
 * - beforeunload confirmation
 *
 * Batched violation reporting to server.
 * Client-side detection is UX only — server holds the authority.
 */

import { useEffect, useCallback, useRef, useState } from "react";
import { reportViolations } from "@/features/exam/services/anti-cheat";
import { useExamStore } from "@/features/exam/store/exam-store";
import type { ExamViolationType, WarningLevel } from "@/types/exam";

interface UseAntiCheatProps {
  attemptId: string;
  enabled?: boolean;
}

interface UseAntiCheatReturn {
  violationCount: number;
  isFlagged: boolean;
  warningLevel: WarningLevel;
  lastViolationType: ExamViolationType | null;
  showWarning: boolean;
  warningMessage: string;
  dismissWarning: () => void;
}

const VIOLATION_WARNING_THRESHOLD = 3;
const VIOLATION_CRITICAL_THRESHOLD = 6;
const REPORT_INTERVAL_MS = 30_000;

// Messages per violation type
const VIOLATION_MESSAGES: Record<ExamViolationType, string> = {
  TAB_SWITCH: "Tab switching is being monitored. Stay on this page.",
  WINDOW_BLUR: "Please keep focus on the exam window.",
  COPY_ATTEMPT: "Copying content is disabled during the exam.",
  RIGHT_CLICK: "Right-click is disabled during the exam.",
};

const CRITICAL_MESSAGE = "Multiple violations detected. Your attempt has been flagged for review.";

export function useAntiCheat({ attemptId, enabled = true }: UseAntiCheatProps): UseAntiCheatReturn {
  const incrementViolations = useExamStore((s) => s.incrementViolations);
  const setFlagged = useExamStore((s) => s.setFlagged);
  const violationCount = useExamStore((s) => s.violationCount);
  const isFlagged = useExamStore((s) => s.isFlagged);

  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [lastViolationType, setLastViolationType] = useState<ExamViolationType | null>(null);

  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pending violations buffer for batched reporting
  const pendingViolationsRef = useRef<Record<ExamViolationType, number[]>>({
    TAB_SWITCH: [],
    WINDOW_BLUR: [],
    COPY_ATTEMPT: [],
    RIGHT_CLICK: [],
  });

  // Compute warning level
  const warningLevel: WarningLevel =
    violationCount >= VIOLATION_CRITICAL_THRESHOLD
      ? "critical"
      : violationCount >= VIOLATION_WARNING_THRESHOLD
        ? "warning"
        : "none";

  const dismissWarning = useCallback(() => {
    setShowWarning(false);
    setWarningMessage("");
  }, []);

  // Show warning toast
  const showViolationWarning = useCallback((type: ExamViolationType, totalViolations: number) => {
    // Clear existing timer
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }

    const message =
      totalViolations >= VIOLATION_CRITICAL_THRESHOLD ? CRITICAL_MESSAGE : VIOLATION_MESSAGES[type];

    setWarningMessage(message);
    setShowWarning(true);
    setLastViolationType(type);

    // Auto-dismiss after 5 seconds
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(false);
    }, 5000);
  }, []);

  // Record a violation
  const recordViolation = useCallback(
    (type: ExamViolationType) => {
      pendingViolationsRef.current[type].push(Date.now());
      incrementViolations();

      // Get new count after increment
      const newCount = violationCount + 1;
      showViolationWarning(type, newCount);
    },
    [incrementViolations, violationCount, showViolationWarning]
  );

  // Flush violations to server
  const flushViolations = useCallback(async () => {
    const violations: {
      type: ExamViolationType;
      count: number;
      timestamps: number[];
    }[] = [];

    for (const type of Object.keys(pendingViolationsRef.current) as ExamViolationType[]) {
      const timestamps = pendingViolationsRef.current[type];
      if (timestamps.length > 0) {
        violations.push({
          type,
          count: timestamps.length,
          timestamps: [...timestamps],
        });
        pendingViolationsRef.current[type] = [];
      }
    }

    if (violations.length > 0 && attemptId) {
      try {
        const result = await reportViolations(attemptId, violations);
        if (result?.success && result.isFlagged) {
          setFlagged(true);
        }
      } catch {
        // Re-queue on failure
        for (const v of violations) {
          pendingViolationsRef.current[v.type].push(...v.timestamps);
        }
      }
    }
  }, [attemptId, setFlagged]);

  // Event listeners
  useEffect(() => {
    if (!enabled || !attemptId) return;

    // Tab switch
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation("TAB_SWITCH");
      }
    };

    // Window blur
    const handleBlur = () => {
      recordViolation("WINDOW_BLUR");
    };

    // Copy/cut blocking
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      recordViolation("COPY_ATTEMPT");
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      recordViolation("COPY_ATTEMPT");
    };

    // Right-click blocking
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      recordViolation("RIGHT_CLICK");
    };

    // Text selection blocking
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    // Keyboard shortcut blocking
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block: Ctrl+C, Ctrl+A, Ctrl+U, Ctrl+S, Ctrl+P, F12
      if ((e.ctrlKey || e.metaKey) && ["c", "a", "u", "s", "p"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        if (e.key.toLowerCase() === "c") {
          recordViolation("COPY_ATTEMPT");
        }
      }

      if (e.key === "F12") {
        e.preventDefault();
      }
    };

    // beforeunload confirmation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    // Attach all listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Body style for selection prevention
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    // Periodic violation flush
    const flushInterval = setInterval(flushViolations, REPORT_INTERVAL_MS);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Restore body styles
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";

      clearInterval(flushInterval);

      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }

      // Final flush on unmount
      flushViolations();
    };
  }, [enabled, attemptId, recordViolation, flushViolations]);

  return {
    violationCount,
    isFlagged,
    warningLevel,
    lastViolationType,
    showWarning,
    warningMessage,
    dismissWarning,
  };
}
