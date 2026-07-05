import { ResultsPresentationService } from '../services/ResultsPresentationService';

export class ResultsFacade {
  constructor(private presentationService: ResultsPresentationService) {}

  /**
   * Only exposes presentation APIs mapped through the PresentationService.
   */
  public async getSummary(resultId: string): Promise<any> {
    return this.presentationService.getSummaryReadModel(resultId);
  }

  public async getReview(resultId: string): Promise<any> {
    return this.presentationService.getReviewReadModel(resultId);
  }

  public async getInsights(resultId: string): Promise<any> {
    return this.presentationService.getInsightsReadModel(resultId);
  }

  public async getRecommendations(resultId: string): Promise<any> {
    return this.presentationService.getRecommendationsReadModel(resultId);
  }

  public async getSections(resultId: string): Promise<any> {
    return this.presentationService.getSectionsReadModel(resultId);
  }

  public async getExports(resultId: string): Promise<any> {
    return this.presentationService.getExportsReadModel(resultId);
  }
}
