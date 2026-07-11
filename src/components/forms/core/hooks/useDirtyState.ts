import { useState, useCallback } from "react";
import { DirtyState } from "../FormState";

export function useDirtyState() {
  const [state, setState] = useState<DirtyState>("Pristine");

  const setPristine = useCallback(() => setState("Pristine"), []);
  const setModified = useCallback(() => setState("Modified"), []);
  const setRestored = useCallback(() => setState("Restored"), []);
  const setReset = useCallback(() => setState("Reset"), []);
  const setSubmitted = useCallback(() => setState("Submitted"), []);

  return {
    state,
    isDirty: state === "Modified",
    setPristine,
    setModified,
    setRestored,
    setReset,
    setSubmitted,
  };
}
