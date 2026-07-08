// Future-proof AI Adapters

export interface QuestionEmbedding {
  vector: number[];
  model: string;
}

export class SemanticSearchAdapter {
  public async search(query: string): Promise<string[]> { return []; }
}

export class SimilarityIndexAdapter {
  public async findSimilar(questionVersionId: string): Promise<string[]> { return []; }
}

export class AIRecommendationProvider {
  public async generateRecommendations(questionVersionId: string): Promise<string[]> { return []; }
}

export class AIReviewProvider {
  public async automatedReview(questionVersionId: string): Promise<any> { return {}; }
}
