import { SubmissionResult } from '../../submission/models/SubmissionResult';
import { ResultsContext } from '../context/ResultsContext';

export class ResultsKernel {
  /**
   * Orchestrates the ingestion of a SubmissionResult into a ResultAggregate.
   */
  public async process(result: SubmissionResult): Promise<void> {
    console.log(`[ResultsKernel] Processing result for attempt ${result.attempt.attemptId}`);
    
    const context: ResultsContext = { result };

    // 1. Build ResultAggregate
    // 2. Persist to ResultsRepository
    // 3. Populate ResultsCache
    // 4. Update StateMachine to READY
  }
}
