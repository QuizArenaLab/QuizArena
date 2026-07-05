import { SubmissionContext } from '../context/SubmissionContext';

export class AggregateCalculator {
  /**
   * Finalizes the total score.
   */
  public async calculate(context: SubmissionContext): Promise<number> {
    console.log(`[AggregateCalculator] Calculating aggregate score for attempt ${context.package.attemptId}`);
    return 0;
  }
}
