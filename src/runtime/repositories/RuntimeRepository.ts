import { RuntimeSnapshot } from '../models/RuntimeSnapshot';
import { RuntimeAudit, RuntimeMetrics } from '../types/RuntimeOperations';

export interface RuntimeRepository {
  /**
   * Persists immutable snapshots and operational data.
   * Does not persist mutable execution state.
   */
  saveSnapshot(snapshot: RuntimeSnapshot): Promise<void>;
  getSnapshot(snapshotId: string): Promise<RuntimeSnapshot | null>;
  
  saveSessionMetadata(sessionId: string, metadata: any): Promise<void>;
  
  saveMetrics(sessionId: string, metrics: RuntimeMetrics): Promise<void>;
  
  saveAudit(audit: RuntimeAudit): Promise<void>;
}
