import { PipelineContext } from "../types/pipeline.types";
import { RankingWorker } from "../workers/RankingWorker";

export class DomainEventPublisher {
  /**
   * Called strictly AFTER the Prisma transaction successfully commits.
   */
  async publishAfterCommit(context: PipelineContext): Promise<void> {
    // Fire-and-forget: we don't await the workers to block the user request.
    // In production, this would publish to a message queue (e.g., Redis, Kafka).
    // For now, we simulate an async job queue.
    
    console.log(`[DomainEventPublisher] CompetitionSubmitted emitted for session ${context.sessionId}`);
    console.log(`[DomainEventPublisher] AttemptFinalized emitted for session ${context.sessionId}`);

    // Queue ranking update asynchronously
    Promise.resolve().then(async () => {
      try {
        console.log(`[DomainEventPublisher] Triggering async RankingWorker...`);
        const worker = new RankingWorker();
        await worker.processAttempt(context);
      } catch (err) {
        // Log to error tracking system. Ranking is retryable.
        console.error(`[RankingWorker] Failed to process attempt ${context.sessionId}:`, err);
      }
    });
  }
}
