import { PlatformEventBus, PlatformEvent, EventHandler } from "../events/PlatformEventBus";
import { SagaCoordinator } from "./SagaCoordinator";
import { CompetitionProcessManager } from "./CompetitionProcessManager";

export class WorkflowOrchestrator {
  constructor(
    private eventBus: PlatformEventBus,
    private sagaCoordinator: SagaCoordinator,
    private processManager: CompetitionProcessManager
  ) {}

  public start(): void {
    // This forms the core routing topology:
    // Domain Gateway -> Event Bus -> Workflow Orchestrator -> ProcessManager / SagaCoordinator -> Consumer Gateway

    this.eventBus.subscribe("CompetitionPublished", this.handleCompetitionPublished.bind(this));
    this.eventBus.subscribe("SubmissionFinalized", this.handleSubmissionFinalized.bind(this));
    this.eventBus.subscribe("ResultsReady", this.handleResultsReady.bind(this));
    this.eventBus.subscribe("LeaderboardReady", this.handleLeaderboardReady.bind(this));
  }

  private async handleCompetitionPublished(event: PlatformEvent): Promise<void> {
    await this.processManager.transitionCompetitionState(event.payload.competitionId, "PUBLISHED");
    // Orchestrator commands the Runtime to activate
    await this.eventBus.publish({
      eventId: `${event.eventId}-cmd`,
      type: "ActivateRuntimeCommand",
      timestamp: new Date().toISOString(),
      correlationId: event.correlationId,
      workflowId: event.workflowId,
      version: "1.0",
      sourceDomain: "Orchestration",
      payload: { competitionId: event.payload.competitionId },
    } as any);
  }

  private async handleSubmissionFinalized(event: PlatformEvent): Promise<void> {
    // Start the Submission -> Results -> Leaderboard saga
    await this.sagaCoordinator.startSubmissionProcessingSaga(event);
  }

  private async handleResultsReady(event: PlatformEvent): Promise<void> {
    await this.sagaCoordinator.advanceSubmissionProcessingSaga(event.payload.sagaId || event.workflowId, "RESULTS_GENERATED");
  }

  private async handleLeaderboardReady(event: PlatformEvent): Promise<void> {
    await this.sagaCoordinator.advanceSubmissionProcessingSaga(event.payload.sagaId || event.workflowId, "LEADERBOARD_UPDATED");
  }
}
