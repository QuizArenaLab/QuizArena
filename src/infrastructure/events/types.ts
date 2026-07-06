export interface PlatformEvent<T = any> {
  eventId: string;
  eventType: string;
  payload: T;
  aggregateId?: string;
  aggregateType?: string;
  timestamp: Date;
}

export interface IEventBus {
  publish(event: PlatformEvent): Promise<void>;
  subscribe<T>(eventType: string, handler: (event: PlatformEvent<T>) => Promise<void>): void;
}
