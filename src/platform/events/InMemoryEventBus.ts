import { PlatformEvent, PlatformEventBus, EventHandler } from "./PlatformEventBus";
import { EventEmitter } from "events";

export class InMemoryEventBus implements PlatformEventBus {
  private emitter: EventEmitter;
  private static instance: InMemoryEventBus;

  private constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(100);
  }

  public static getInstance(): InMemoryEventBus {
    if (!InMemoryEventBus.instance) {
      InMemoryEventBus.instance = new InMemoryEventBus();
    }
    return InMemoryEventBus.instance;
  }

  public async publish<T extends PlatformEvent>(event: T): Promise<void> {
    // In-memory bus fires events asynchronously but non-blocking
    process.nextTick(() => {
      this.emitter.emit(event.type, event);
    });
  }

  public subscribe<T extends PlatformEvent>(eventType: string, handler: EventHandler<T>): void {
    const safeHandler = async (event: T) => {
      try {
        await handler(event);
      } catch (error) {
        console.error(`[PlatformEventBus] Error handling event ${eventType}:`, error);
      }
    };
    (safeHandler as any).originalHandler = handler;
    this.emitter.on(eventType, safeHandler);
  }

  public unsubscribe<T extends PlatformEvent>(eventType: string, handler: EventHandler<T>): void {
    const listeners = this.emitter.listeners(eventType);
    const listenerToRemove = listeners.find(
      (listener) => (listener as any).originalHandler === handler || listener === handler
    );

    if (listenerToRemove) {
      this.emitter.off(eventType, listenerToRemove as (...args: any[]) => void);
    }
  }
}

export const eventBus = InMemoryEventBus.getInstance();

const withRetry = async (fn: () => Promise<void>, maxRetries = 3, delayMs = 1000) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      await fn();
      return;
    } catch (error) {
      attempt++;
      console.warn(`[EventBus] Worker execution failed (Attempt ${attempt}/${maxRetries}):`, error);
      if (attempt >= maxRetries) {
        console.error(`[EventBus] Worker execution permanently failed after ${maxRetries} attempts.`);
        throw error;
      }
      await new Promise(res => setTimeout(res, delayMs * Math.pow(2, attempt - 1))); // Exponential backoff
    }
  }
};

// Auto-register workers (In production, this would be a separate worker process listening to Redis/Kafka)
eventBus.subscribe("RankingCandidateGenerated", async (event) => {
  const { competitionId } = event.payload;
  if (!competitionId) return;
  
  await withRetry(async () => {
    const { RankingWorker } = await import("@/features/competitions/ranking/workers/RankingWorker");
    await RankingWorker.executeCompetitionRanking(competitionId);
  });
});

eventBus.subscribe("CertificateEligibilityGenerated", async (event) => {
  await withRetry(async () => {
    const { CertificateWorker } = await import("@/features/competitions/certificates/workers/CertificateWorker");
    await CertificateWorker.processEligibility(event.payload as any);
  });
});
