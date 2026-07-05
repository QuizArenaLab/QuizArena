import { SubmissionContext } from '../context/SubmissionContext';

export class SectionScoreCalculator {
  /**
   * Aggregates scores per section.
   */
  public async calculate(context: SubmissionContext): Promise<any> {
    console.log(`[SectionScoreCalculator] Calculating section scores for attempt ${context.package.attemptId}`);
    return {};
  }
}
