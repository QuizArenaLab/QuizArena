import { PlatformEventBus, PlatformEvent } from '../events/PlatformEventBus';
import { randomUUID } from 'crypto';

export type SagaState = 'STARTED' | 'RESULTS_GENERATED' | 'LEADERBOARD_UPDATED' | 'COMPLETED' | 'FAILED' | 'COMPENSATED';

export interface SagaInstance {
  sagaId: string;
  workflowId: string;
  state: SagaState;
  data: any;
}

export class SagaCoordinator {
  private sagas = new Map<string, SagaInstance>();

  constructor(private eventBus: PlatformEventBus) {}

  public async startSubmissionProcessingSaga(event: PlatformEvent): Promise<void> {
    const sagaId = randomUUID();
    this.sagas.set(sagaId, {
      sagaId,
      workflowId: 'SubmissionProcessingWorkflow',
      state: 'STARTED',
      data: { submissionId: event.payload?.submissionId }
    });

    // Command the Results domain to generate results
    await this.eventBus.publish({
      eventId: `${event.eventId}-cmd-results`,
      type: 'GenerateResultsCommand',
      timestamp: new Date(),
      sagaId,
      payload: event.payload
    });
  }

  public async advanceSubmissionProcessingSaga(sagaId: string, newState: SagaState): Promise<void> {
    const saga = this.sagas.get(sagaId);
    if (!saga) throw new Error(`Saga ${sagaId} not found`);

    saga.state = newState;
    this.sagas.set(sagaId, saga);

    if (newState === 'RESULTS_GENERATED') {
      // Results are generated, now command Leaderboard via Submission publishing RankingCandidateSnapshot
      // Actually, Submission already publishes RankingCandidateSnapshot directly based on Results,
      // But the Orchestrator monitors the progression.
      console.log(`Saga ${sagaId} advanced to ${newState}`);
    } else if (newState === 'LEADERBOARD_UPDATED') {
      saga.state = 'COMPLETED';
      this.sagas.set(sagaId, saga);
      console.log(`Saga ${sagaId} completed successfully`);
      
      // Could trigger Rewards/Certificates here
    }
  }

  public async compensate(sagaId: string, reason: string): Promise<void> {
    const saga = this.sagas.get(sagaId);
    if (!saga) return;
    
    console.error(`Compensating Saga ${sagaId} due to: ${reason}`);
    saga.state = 'COMPENSATED';
    
    // Publish compensation commands (e.g., rollback results)
  }
}
