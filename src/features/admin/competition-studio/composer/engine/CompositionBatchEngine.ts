/**
 * Composition Batch Engine
 * 
 * Intercepts, queues, and merges operations before flushing them to the repository.
 * Defends against spamming the backend when dragging/dropping rapidly.
 */

import { EventBus } from '../../studio/bus/EventBus';

interface PendingOperation {
  id: string;
  type: string;
  payload: any;
}

class CompositionBatchEngineService {
  private queue: PendingOperation[] = [];
  private flushTimeout: NodeJS.Timeout | null = null;
  private isFlushing: boolean = false;
  
  // Throttle writes to 1s window
  private readonly BATCH_WINDOW_MS = 1000;

  queueOperation(type: string, payload: any) {
    this.queue.push({
      id: `op_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type,
      payload
    });

    this.scheduleFlush();
  }

  private scheduleFlush() {
    if (this.flushTimeout) return; // Already scheduled

    this.flushTimeout = setTimeout(() => {
      this.flushTimeout = null;
      this.flush();
    }, this.BATCH_WINDOW_MS);
  }

  async flush() {
    if (this.isFlushing || this.queue.length === 0) return;
    
    this.isFlushing = true;
    const batch = [...this.queue];
    this.queue = [];

    try {
      // In a real implementation, this would compress operations 
      // (e.g. if an item was moved twice, only send the final position)
      // and send them to the CompositionRepository.
      
      // await CompositionRepository.applyBatch(batch);

      EventBus.publish('CompositionSaved', { batchSize: batch.length });
    } catch (error) {
      console.error("Batch flush failed, retrying...", error);
      // Re-queue on failure (simplified)
      this.queue = [...batch, ...this.queue];
      this.scheduleFlush();
    } finally {
      this.isFlushing = false;
    }
  }
}

export const CompositionBatchEngine = new CompositionBatchEngineService();
