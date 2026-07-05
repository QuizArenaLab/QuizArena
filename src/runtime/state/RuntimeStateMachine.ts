export enum RuntimeState {
  INITIALIZING = 'INITIALIZING',
  READY = 'READY',
  ACTIVE = 'ACTIVE',
  SYNCING = 'SYNCING',
  RECOVERING = 'RECOVERING',
  SUBMITTING = 'SUBMITTING',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED'
}

export class RuntimeStateMachine {
  private currentState: RuntimeState = RuntimeState.INITIALIZING;

  public transitionTo(newState: RuntimeState): void {
    console.log(`[RuntimeStateMachine] Transitioning from ${this.currentState} to ${newState}`);
    this.currentState = newState;
  }

  public getState(): RuntimeState {
    return this.currentState;
  }
}
