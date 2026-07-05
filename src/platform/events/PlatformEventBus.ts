export interface PlatformEvent {
  eventId: string;
  type: string;
  timestamp: string; // ISO String
  correlationId: string;
  workflowId?: string;
  version: string;
  sourceDomain: string;
  payload: any;
}

export type EventHandler<T extends PlatformEvent> = (event: T) => void | Promise<void>;

export interface PlatformEventBus {
  publish<T extends PlatformEvent>(event: T): Promise<void>;
  subscribe<T extends PlatformEvent>(eventType: string, handler: EventHandler<T>): void;
  unsubscribe<T extends PlatformEvent>(eventType: string, handler: EventHandler<T>): void;
}
