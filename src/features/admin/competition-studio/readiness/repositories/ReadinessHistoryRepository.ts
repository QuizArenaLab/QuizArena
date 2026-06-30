/**
 * Readiness History Repository
 * 
 * Persists the immutable Readiness Snapshots over time.
 * Purely projection queries.
 */

import { ReadinessSnapshot } from '../types/readiness.types';

class ReadinessHistoryRepositoryService {
  private history: ReadinessSnapshot[] = [];

  saveSnapshot(snapshot: ReadinessSnapshot) {
    // In production, we'd insert this into a Prisma `ReadinessHistory` table
    this.history.push(snapshot);
  }

  getLatestSnapshot(): ReadinessSnapshot | null {
    if (this.history.length === 0) return null;
    return this.history[this.history.length - 1];
  }

  getHistory(): ReadinessSnapshot[] {
    return this.history;
  }
}

export const ReadinessHistoryRepository = new ReadinessHistoryRepositoryService();
