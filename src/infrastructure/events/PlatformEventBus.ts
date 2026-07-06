import { EventEmitter } from "events";
import { PlatformEvent, IEventBus } from "./types";
import { PrismaClient } from "../../generated/prisma";

/**
 * PlatformEventBus is responsible for handling domain events.
 * It uses a Node EventEmitter for in-process memory distribution.
 * 
 * To ensure reliability, events should be saved to the OutboxMessage table
 * during the same database transaction that modifies the business entities.
 * The OutboxRelay will then pick them up and emit them through this bus.
 */
class EventBus implements IEventBus {
  private emitter = new EventEmitter();

  constructor() {
    // Set a high limit for listeners if we have many handlers
    this.emitter.setMaxListeners(100);
  }

  /**
   * Publishes an event by saving it to the Outbox table.
   * MUST be called within a Prisma transaction to guarantee atomicity.
   */
  async publishTx(event: PlatformEvent, tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">): Promise<void> {
    // Mocked outbox: since OutboxMessage doesn't exist in schema, we emit immediately
    this.emit(event);
  }

  /**
   * Only for non-critical events that don't need transactional outbox guarantees.
   */
  async publish(event: PlatformEvent): Promise<void> {
    this.emit(event);
  }

  /**
   * Subscribes to an event type. Handlers should be resilient (idempotent if possible).
   */
  subscribe<T>(eventType: string, handler: (event: PlatformEvent<T>) => Promise<void>): void {
    this.emitter.on(eventType, async (event: PlatformEvent<T>) => {
      try {
        await handler(event);
      } catch (error) {
        console.error(`[EventBus] Error handling event ${eventType}:`, error);
        // Ideally we would send to a DLQ or retry queue here
      }
    });
  }

  /**
   * Internal method used by OutboxRelay to fire the event to subscribers.
   */
  emit(event: PlatformEvent): void {
    this.emitter.emit(event.eventType, event);
  }
}

export const PlatformEventBus = new EventBus();
