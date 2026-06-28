"use client";

import { useEffect, useRef, useState } from "react";
import { useWizardStore } from "../context/useWizardStore";

export function useWizardAutoSave() {
  const { draftData } = useWizardStore();
  const [savingState, setSavingState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // In a real app, this would debounce saving the local storage or a draft API
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavingState("saving");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setSavingState("saved");
    }, 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [draftData]);

  return { savingState, hasUnsavedChanges: false, concurrentEditDetected: false };
}
