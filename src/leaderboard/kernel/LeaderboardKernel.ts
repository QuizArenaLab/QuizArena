import { LeaderboardContext } from '../context/LeaderboardContext';
import { LeaderboardStateMachine, LeaderboardState } from '../state/LeaderboardStateMachine';
// We would import RankingMaterializer here later

export class LeaderboardKernel {
  private stateMachine: LeaderboardStateMachine;
  // private materializer: RankingMaterializer;

  constructor() {
    this.stateMachine = new LeaderboardStateMachine();
    // this.materializer = new RankingMaterializer(...);
  }

  public async processCandidate(context: LeaderboardContext): Promise<void> {
    try {
      this.stateMachine.transitionTo(LeaderboardState.LOADING);
      
      // 1. Load existing aggregate from repository (delegated to some loader/service)
      // context.setExistingAggregate(loadedAggregate);

      this.stateMachine.transitionTo(LeaderboardState.MATERIALIZING);
      
      // 2. Materialize
      // const newAggregate = await this.materializer.materialize(context);

      this.stateMachine.transitionTo(LeaderboardState.PERSISTING);
      
      // 3. Persist new aggregate to repositories
      // await this.repository.save(newAggregate);

      this.stateMachine.transitionTo(LeaderboardState.READY);
    } catch (error) {
      this.stateMachine.transitionTo(LeaderboardState.FAILED);
      // Handle or rethrow
      throw error;
    }
  }
}
