import { PlatformEventBus, EventHandler } from '../../platform/events/PlatformEventBus';
import { RankingCandidateSnapshotEvent } from '../../submission/events/SubmissionEvents';
import { LeaderboardKernel } from '../kernel/LeaderboardKernel';
import { LeaderboardContext } from '../context/LeaderboardContext';

export class LeaderboardGateway {
  private eventBus: PlatformEventBus;
  private kernel: LeaderboardKernel;

  constructor(eventBus: PlatformEventBus, kernel: LeaderboardKernel) {
    this.eventBus = eventBus;
    this.kernel = kernel;
  }

  public init(): void {
    this.eventBus.subscribe<RankingCandidateSnapshotEvent>(
      'RankingCandidateSnapshot',
      this.handleRankingCandidate.bind(this)
    );
  }

  private async handleRankingCandidate(event: RankingCandidateSnapshotEvent): Promise<void> {
    const candidate = event.snapshot;
    
    // Create Context
    const context = new LeaderboardContext({
      competitionId: candidate.competitionId,
      scope: candidate.leaderboardScope,
      policy: {}, // Load policy
      algorithm: {} // Load algorithm
    });
    
    context.setCandidate(candidate);

    // Orchestrate through Kernel
    await this.kernel.processCandidate(context);
  }
}
