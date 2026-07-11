export type FormLifecycleState =
  | "CREATED"
  | "INITIALIZED"
  | "EDITING"
  | "VALIDATING"
  | "READY"
  | "SUBMITTING"
  | "SUBMITTED"
  | "FAILED"
  | "RESET";

export class FormLifecycleMachine {
  private currentState: FormLifecycleState = "CREATED";

  // Define valid transitions
  private transitions: Record<FormLifecycleState, FormLifecycleState[]> = {
    CREATED: ["INITIALIZED"],
    INITIALIZED: ["EDITING", "READY"],
    EDITING: ["VALIDATING", "RESET"],
    VALIDATING: ["READY", "EDITING"],
    READY: ["SUBMITTING", "EDITING", "RESET"],
    SUBMITTING: ["SUBMITTED", "FAILED"],
    SUBMITTED: ["RESET", "EDITING"],
    FAILED: ["EDITING", "SUBMITTING", "RESET"],
    RESET: ["INITIALIZED"],
  };

  getState(): FormLifecycleState {
    return this.currentState;
  }

  transition(nextState: FormLifecycleState): boolean {
    const validNextStates = this.transitions[this.currentState];
    if (validNextStates.includes(nextState)) {
      this.currentState = nextState;
      return true;
    }
    console.error(`Invalid form lifecycle transition from ${this.currentState} to ${nextState}`);
    return false;
  }
}
