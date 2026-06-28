type PublishingEvent =
  | { type: "COMPETITION_PUBLISHED"; competitionId: string; publishedBy: string }
  | { type: "COMPETITION_SCHEDULED"; competitionId: string; scheduledFor: string }
  | { type: "COMPETITION_EXPIRED"; competitionId: string }
  | { type: "VALIDATION_FAILED"; competitionId: string; errorCount: number }
  | { type: "COMPETITION_ARCHIVED"; competitionId: string }
  | { type: "VERSION_ROLLED_BACK"; competitionId: string; toVersion: number };

type EventHandler = (event: PublishingEvent) => void;

class DomainEventBus {
  private handlers: Set<EventHandler> = new Set();

  subscribe(handler: EventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  emit(event: PublishingEvent): void {
    this.handlers.forEach((handler) => {
      try {
        handler(event);
      } catch (err) {
        console.error("Error in event handler:", err);
      }
    });
  }
}

export const publishingEventBus = new DomainEventBus();

export function emitPublishingEvent(event: PublishingEvent): void {
  publishingEventBus.emit(event);
}

export function onPublishingEvent(handler: EventHandler): () => void {
  return publishingEventBus.subscribe(handler);
}
