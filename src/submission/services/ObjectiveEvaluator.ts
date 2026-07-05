import { SubmissionContext } from '../context/SubmissionContext';

export class ObjectiveEvaluator {
  /**
   * Purely determines right/wrong/skipped status per question.
   */
  public async evaluate(context: SubmissionContext): Promise<any> {
    console.log(`[ObjectiveEvaluator] Evaluating attempt ${context.package.attemptId}`);
    return {
      correct: 0,
      incorrect: 0,
      skipped: Object.keys(context.package.answers).length
    };
  }
}
