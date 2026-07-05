export interface PlatformEventContract<T = any> {
  eventId: string;
  eventName: string;
  eventVersion: string;
  occurredAt: Date;
  producer: string;
  correlationId: string;
  causationId?: string;
  workflowId?: string;
  schemaVersion: string;
  payload: Readonly<T>; // Immutable DTOs or Snapshots only
}
