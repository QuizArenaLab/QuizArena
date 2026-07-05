import { PlatformEvent, PlatformEventBus, EventHandler } from './PlatformEventBus';
import { EventEmitter } from 'events';

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
    this.emitter.on(eventType, handler as any);
  }

  public unsubscribe<T extends PlatformEvent>(eventType: string, handler: EventHandler<T>): void {
    this.emitter.off(eventType, handler as any);
  }
}
