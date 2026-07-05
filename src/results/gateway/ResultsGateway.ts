import { SubmissionResult } from '../../submission/models/SubmissionResult';
import { ResultsKernel } from '../kernel/ResultsKernel';

export class ResultsGateway {
  constructor(private kernel: ResultsKernel) {}

  /**
   * Ingests the SubmissionResult payload emitted from the event bus.
   */
  public async ingestResult(result: SubmissionResult): Promise<void> {
    console.log(`[ResultsGateway] Ingesting result for attempt ${result.attempt.attemptId}`);
    
    // Pass to kernel to build Aggregate and persist
    await this.kernel.process(result);
  }
}
