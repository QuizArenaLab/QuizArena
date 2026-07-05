export enum ResultsState {
  GENERATING = 'GENERATING',
  READY = 'READY',
  VIEWED = 'VIEWED',
  EXPORTED = 'EXPORTED',
  ARCHIVED = 'ARCHIVED'
}

export class ResultsStateMachine {
  private currentState: ResultsState = ResultsState.GENERATING;

  public transitionTo(newState: ResultsState): void {
    console.log(`[ResultsStateMachine] Transitioning from ${this.currentState} to ${newState}`);
    this.currentState = newState;
  }

  public getState(): ResultsState {
    return this.currentState;
  }
}
