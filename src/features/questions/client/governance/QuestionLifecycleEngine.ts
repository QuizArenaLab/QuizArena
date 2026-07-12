export type QuestionState =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "ACTIVE"
  | "DEPRECATED"
  | "ARCHIVED";

export class QuestionLifecycleEngine {
  public async transition(
    questionId: string,
    newState: QuestionState,
    actorId: string
  ): Promise<void> {
    // Audit log state transition
  }

  public async getLifecycleHistory(questionId: string): Promise<any[]> {
    return [];
  }
}
