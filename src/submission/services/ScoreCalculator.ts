import { SubmissionContext } from '../context/SubmissionContext';

export class ScoreCalculator {
  /**
   * Computes point values based on rules (e.g., negative marking).
   */
  public async calculate(context: SubmissionContext): Promise<any> {
    console.log(`[ScoreCalculator] Calculating score for attempt ${context.package.attemptId}`);
    return {
      marks: 0,
      negativeMarks: 0
    };
  }
}
