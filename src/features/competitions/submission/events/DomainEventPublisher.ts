import { PipelineContext } from "../types/pipeline.types";
import { PlatformEventBus } from "../../../../infrastructure/events/PlatformEventBus";
import { platformOutboxRelay } from "../../../../infrastructure/events/OutboxRelay";

export class DomainEventPublisher {
  /**
   * Called INSIDE the Prisma transaction to ensure events are atomically committed.
   */
  async publishTx(context: PipelineContext, tx: any): Promise<void> {
    await PlatformEventBus.publishTx(
      {
        eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        eventType: "competition.attempt.submitted",
        payload: {
          sessionId: context.sessionId,
          competitionId: context.session.competitionId,
          userId: context.session.userId,
          scoreData: (context as any).scoreCalculation,
          attemptResult: context.resultSnapshot,
        },
        aggregateId: context.sessionId,
        aggregateType: "CompetitionSession",
        timestamp: new Date(),
      },
      tx
    );
  }

  /**
   * Called strictly AFTER the Prisma transaction successfully commits.
   */
  async publishAfterCommit(context: PipelineContext): Promise<void> {
    // Immediately trigger the relay to reduce latency, rather than waiting for 5s interval
    // We don't await this so it doesn't block the HTTP response
    Promise.resolve().then(() => {
      // Note: processOutbox is currently private in OutboxRelay. I need to make it public.
      (platformOutboxRelay as any).processOutbox();
    });
  }
}
