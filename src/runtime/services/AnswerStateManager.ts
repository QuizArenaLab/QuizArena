import { RuntimeContext } from '../context/RuntimeContext';

export class AnswerStateManager {
  private answers: Map<string, any> = new Map();
  private reviewMarks: Set<string> = new Set();

  /**
   * The exclusive owner of the user's answers, modifications, and review marks.
   */
  public async setAnswer(context: RuntimeContext, questionId: string, payload: any): Promise<void> {
    console.log(`[AnswerStateManager] Setting answer for ${questionId}`);
    this.answers.set(questionId, payload);
    // Triggers AutoSavePipeline
  }

  public async markForReview(context: RuntimeContext, questionId: string, isMarked: boolean): Promise<void> {
    if (isMarked) {
      this.reviewMarks.add(questionId);
    } else {
      this.reviewMarks.delete(questionId);
    }
  }

  public getSnapshot(): { answers: any; reviewMarks: string[] } {
    return {
      answers: Object.fromEntries(this.answers),
      reviewMarks: Array.from(this.reviewMarks)
    };
  }
}
