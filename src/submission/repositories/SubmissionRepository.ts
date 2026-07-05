import { SubmissionPackage } from '../../runtime/submission/SubmissionPackage';
import { EvaluationSnapshot } from '../models/EvaluationSnapshot';
import { SubmissionResult } from '../models/SubmissionResult';
import { SubmissionMetrics, SubmissionAudit } from '../types/SubmissionOperations';

export interface SubmissionRepository {
  /**
   * Persists immutable evaluation artifacts.
   */
  savePackage(pkg: SubmissionPackage): Promise<void>;
  
  saveEvaluationSnapshot(snapshot: EvaluationSnapshot): Promise<void>;
  
  saveResult(result: SubmissionResult): Promise<void>;
  
  saveMetrics(metrics: SubmissionMetrics): Promise<void>;
  
  saveAudit(audit: SubmissionAudit): Promise<void>;
}
