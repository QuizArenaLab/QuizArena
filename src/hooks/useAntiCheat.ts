"use client";

import { useEffect, useState, useCallback } from "react";
import { trackViolation } from "@/actions/quiz-engine";

interface UseAntiCheatProps {
  attemptId: string;
  onViolation: (type: "TAB_SWITCH" | "WINDOW_BLUR" | "COPY_ATTEMPT" | "RIGHT_CLICK") => void;
  maxViolations?: number;
}

export function useAntiCheat({ attemptId, onViolation, maxViolations = 5 }: UseAntiCheatProps) {
  const [violationCount, setViolationCount] = useState(0);

  const handleViolation = useCallback(
    async (type: "TAB_SWITCH" | "WINDOW_BLUR" | "COPY_ATTEMPT" | "RIGHT_CLICK") => {
      setViolationCount((prev) => prev + 1);
      onViolation(type);

      try {
        await trackViolation(attemptId, type);
      } catch (error) {
        console.error("Failed to log violation to server", error);
      }
    },
    [attemptId, onViolation]
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleViolation("TAB_SWITCH");
      }
    };

    const handleBlur = () => {
      handleViolation("WINDOW_BLUR");
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      handleViolation("COPY_ATTEMPT");
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      handleViolation("RIGHT_CLICK");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [handleViolation]);

  return { violationCount, isFlagged: violationCount >= maxViolations };
}
