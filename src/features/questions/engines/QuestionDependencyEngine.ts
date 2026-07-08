export type DependencyType = 'PARENT' | 'CHILD' | 'BUNDLE' | 'COMPOSITE' | 'SEQUENCE';

export class QuestionDependencyEngine {
  public async linkQuestions(parentId: string, childIds: string[], type: DependencyType): Promise<void> {
    // Links questions together
  }

  public async getDependencies(questionId: string): Promise<any[]> {
    return [];
  }
}
