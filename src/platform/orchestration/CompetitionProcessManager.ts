export type CompetitionState = 'DRAFT' | 'FROZEN' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export class CompetitionProcessManager {
  private competitionStates = new Map<string, CompetitionState>();

  public async transitionCompetitionState(competitionId: string, newState: CompetitionState): Promise<void> {
    const currentState = this.competitionStates.get(competitionId) || 'DRAFT';
    
    // In a real system, we'd validate the transition.
    // DRAFT -> FROZEN -> PUBLISHED -> ACTIVE -> COMPLETED -> ARCHIVED
    
    this.competitionStates.set(competitionId, newState);
    
    // Process manager can also trigger side-effects based on transitions
    // E.g. if ACTIVE -> COMPLETED, trigger Leaderboard freeze, Reward distribution, etc.
  }

  public getCompetitionState(competitionId: string): CompetitionState {
    return this.competitionStates.get(competitionId) || 'DRAFT';
  }
}
