export class ContentReviewEngine {
  public async submitForReview(questionVersionId: string, authorId: string): Promise<void> {}
  
  public async addComment(reviewId: string, reviewerId: string, comment: string): Promise<void> {}
  
  public async suggestChange(reviewId: string, reviewerId: string, patch: any): Promise<void> {}
  
  public async resolveReview(reviewId: string, resolution: 'APPROVED' | 'CHANGES_REQUESTED'): Promise<void> {}
}
