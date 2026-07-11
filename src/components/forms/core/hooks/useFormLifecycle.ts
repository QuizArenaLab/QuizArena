import { useState, useCallback } from "react";
import { FormLifecycleMachine, FormLifecycleState } from "../FormLifecycle";

export function useFormLifecycle() {
  const [machine] = useState(() => new FormLifecycleMachine());
  const [currentState, setCurrentState] = useState<FormLifecycleState>(machine.getState());

  const transition = useCallback(
    (nextState: FormLifecycleState) => {
      if (machine.transition(nextState)) {
        setCurrentState(machine.getState());
        return true;
      }
      return false;
    },
    [machine]
  );

  return {
    state: currentState,
    transition,
  };
}
