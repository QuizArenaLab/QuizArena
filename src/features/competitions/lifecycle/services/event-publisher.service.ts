export enum CompetitionEventType {
  COMPETITION_READY = 'COMPETITION_READY',
  COMPETITION_SCHEDULED = 'COMPETITION_SCHEDULED',
  COMPETITION_STARTED = 'COMPETITION_STARTED',
  COMPETITION_PAUSED = 'COMPETITION_PAUSED',
  COMPETITION_RESUMED = 'COMPETITION_RESUMED',
  COMPETITION_COMPLETED = 'COMPETITION_COMPLETED',
  COMPETITION_EXPIRED = 'COMPETITION_EXPIRED',
  COMPETITION_ARCHIVED = 'COMPETITION_ARCHIVED',
  COMPETITION_CANCELLED = 'COMPETITION_CANCELLED',
  COMPETITION_LIFECYCLE_CHANGED = 'COMPETITION_LIFECYCLE_CHANGED',
}

export interface CompetitionEventPayload {
  competitionId: string;
  previousState?: string;
  newState: string;
  timestamp: Date;
  actorId?: string;
  metadata?: Record<string, any>;
}

export interface EventPublisher {
  publish(event: CompetitionEventType, payload: CompetitionEventPayload): Promise<void>;
  subscribe(event: CompetitionEventType, handler: (payload: CompetitionEventPayload) => Promise<void>): void;
}

class InMemoryEventPublisher implements EventPublisher {
  private handlers: Map<CompetitionEventType, Array<(payload: CompetitionEventPayload) => Promise<void>>> = new Map();

  async publish(event: CompetitionEventType, payload: CompetitionEventPayload): Promise<void> {
    const eventHandlers = this.handlers.get(event) || [];
    await Promise.allSettled(eventHandlers.map(handler => handler(payload)));
  }

  subscribe(event: CompetitionEventType, handler: (payload: CompetitionEventPayload) => Promise<void>): void {
    const currentHandlers = this.handlers.get(event) || [];
    this.handlers.set(event, [...currentHandlers, handler]);
  }
}

export const eventPublisher = new InMemoryEventPublisher();
