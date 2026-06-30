/**
 * Composition History Engine
 * 
 * Tracks structural modifications as reversible transactions.
 * Enables robust Undo/Redo across the entire Composer workspace.
 */

import { EventBus } from '../../studio/bus/EventBus';

export interface HistoryTransaction {
  id: string;
  type: string;
  timestamp: number;
  undo: () => void;
  redo: () => void;
  description: string;
}

class CompositionHistoryEngineService {
  private history: HistoryTransaction[] = [];
  private pointer: number = -1;
  private readonly MAX_HISTORY = 50;

  push(transaction: Omit<HistoryTransaction, 'id' | 'timestamp'>) {
    // If we're not at the end of the history stack, truncate the future
    if (this.pointer < this.history.length - 1) {
      this.history = this.history.slice(0, this.pointer + 1);
    }

    this.history.push({
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
    });

    if (this.history.length > this.MAX_HISTORY) {
      this.history.shift();
    } else {
      this.pointer++;
    }
  }

  undo() {
    if (this.pointer >= 0) {
      const txn = this.history[this.pointer];
      txn.undo();
      this.pointer--;
      EventBus.publish('CompositionUpdated', { source: 'undo', transactionId: txn.id });
    }
  }

  redo() {
    if (this.pointer < this.history.length - 1) {
      this.pointer++;
      const txn = this.history[this.pointer];
      txn.redo();
      EventBus.publish('CompositionUpdated', { source: 'redo', transactionId: txn.id });
    }
  }

  canUndo() {
    return this.pointer >= 0;
  }

  canRedo() {
    return this.pointer < this.history.length - 1;
  }
}

export const CompositionHistoryEngine = new CompositionHistoryEngineService();
