import type { RuntimeEvent } from "../types/runtime.types";

type EventCallback = (event: RuntimeEvent) => void;

/**
 * Lightweight publish-subscribe Event Bus for Runtime.
 * Managers subscribe to domain events here.
 */
export class EventBus {
  private subscribers: Map<string, Set<EventCallback>> = new Map();

  subscribe(eventType: string, callback: EventCallback): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(eventType);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscribers.delete(eventType);
        }
      }
    };
  }

  subscribeAll(callback: EventCallback): () => void {
    return this.subscribe("*", callback);
  }

  emit(eventType: string, payload: any, sessionId: string, runtimeVersion: string = "1.0.0") {
    const event: RuntimeEvent = {
      eventId: crypto.randomUUID(),
      eventType,
      sessionId,
      timestamp: Date.now(),
      runtimeVersion,
      payload,
    };

    const subs = this.subscribers.get(eventType);
    if (subs) {
      subs.forEach((cb) => {
        try {
          cb(event);
        } catch (error) {
          console.error(`[EventBus] Error in subscriber for ${eventType}:`, error);
        }
      });
    }

    // Optional: Global wildcard listener for observability/debugging
    const wildcardSubs = this.subscribers.get("*");
    if (wildcardSubs) {
      wildcardSubs.forEach((cb) => {
        try {
          cb(event);
        } catch (e) {}
      });
    }
  }

  clear() {
    this.subscribers.clear();
  }
}
