import { PlatformEventContract } from '../contracts/PlatformEventContract';

export interface DeadLetterEntry {
  id: string;
  failedAt: Date;
  event: PlatformEventContract;
  error: {
    message: string;
    code: string;
    stack?: string;
  };
  retryCount: number;
}

export class DeadLetterQueue {
  private queue: DeadLetterEntry[] = [];

  public async push(event: PlatformEventContract, error: Error, retryCount: number = 0): Promise<void> {
    const entry: DeadLetterEntry = {
      id: event.eventId || `dlq-${Date.now()}`,
      failedAt: new Date(),
      event,
      error: {
        message: error.message,
        code: (error as any).code || 'UNKNOWN',
        stack: error.stack
      },
      retryCount
    };
    
    this.queue.push(entry);
    console.error(`[DLQ] Event ${event.eventName} failed and moved to DLQ. Reason: ${error.message}`);
  }

  public async getPending(): Promise<DeadLetterEntry[]> {
    return [...this.queue];
  }

  public async remove(id: string): Promise<void> {
    this.queue = this.queue.filter(e => e.id !== id);
  }
}
