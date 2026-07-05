export enum SubmissionState {
  RECEIVED = 'RECEIVED',
  VALIDATING = 'VALIDATING',
  VALIDATED = 'VALIDATED',
  FRAUD_CHECK = 'FRAUD_CHECK',
  EVALUATING = 'EVALUATING',
  CALCULATING = 'CALCULATING',
  FINALIZING = 'FINALIZING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export class SubmissionStateMachine {
  private currentState: SubmissionState = SubmissionState.RECEIVED;

  public transitionTo(newState: SubmissionState): void {
    console.log(`[SubmissionStateMachine] Transitioning from ${this.currentState} to ${newState}`);
    this.currentState = newState;
  }

  public getState(): SubmissionState {
    return this.currentState;
  }
}
