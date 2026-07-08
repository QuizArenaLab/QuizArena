export class QuestionVersionEngine {
  public async branchNewVersion(questionId: string, changes: any, actorId: string): Promise<string> {
    // Emits new QuestionVersion snapshot
    // E.g. V1 -> V2
    return `V2_${questionId}`;
  }

  public async getLatestPublishedVersion(questionId: string): Promise<any> {
    return { version: 'V2', status: 'PUBLISHED' };
  }
}
