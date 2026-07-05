export enum LeaderboardState {
  INITIALIZING = 'INITIALIZING',
  LOADING = 'LOADING',
  MATERIALIZING = 'MATERIALIZING',
  PERSISTING = 'PERSISTING',
  READY = 'READY',
  ARCHIVED = 'ARCHIVED',
  FAILED = 'FAILED'
}

export class LeaderboardStateMachine {
  private currentState: LeaderboardState = LeaderboardState.INITIALIZING;

  public transitionTo(newState: LeaderboardState): void {
    if (this.isValidTransition(this.currentState, newState)) {
      this.currentState = newState;
    } else {
      throw new Error(`Invalid transition from ${this.currentState} to ${newState}`);
    }
  }

  public getState(): LeaderboardState {
    return this.currentState;
  }

  private isValidTransition(from: LeaderboardState, to: LeaderboardState): boolean {
    const transitions: Record<LeaderboardState, LeaderboardState[]> = {
      [LeaderboardState.INITIALIZING]: [LeaderboardState.LOADING, LeaderboardState.FAILED],
      [LeaderboardState.LOADING]: [LeaderboardState.MATERIALIZING, LeaderboardState.FAILED],
      [LeaderboardState.MATERIALIZING]: [LeaderboardState.PERSISTING, LeaderboardState.FAILED],
      [LeaderboardState.PERSISTING]: [LeaderboardState.READY, LeaderboardState.FAILED],
      [LeaderboardState.READY]: [LeaderboardState.ARCHIVED, LeaderboardState.FAILED, LeaderboardState.LOADING], // Support re-loading for next candidate
      [LeaderboardState.ARCHIVED]: [],
      [LeaderboardState.FAILED]: [LeaderboardState.INITIALIZING] // Support retry
    };

    return transitions[from].includes(to);
  }
}
