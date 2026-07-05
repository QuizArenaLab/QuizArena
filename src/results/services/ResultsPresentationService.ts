import { ResultsRepository } from '../repositories/ResultsRepository';
import { ResultsCache } from '../cache/ResultsCache';
import { ResultsReadModel } from '../models/ResultsReadModel';

export class ResultsPresentationService {
  constructor(private repo: ResultsRepository, private cache: ResultsCache) {}

  /**
   * Transforms the canonical ResultAggregate into the Frontend ResultsReadModel.
   */
  public async getSummaryReadModel(resultId: string): Promise<any> {
    const aggregate = await this.repo.getAggregate(resultId);
    return aggregate?.resultSnapshot?.summary || null;
  }

  public async getReviewReadModel(resultId: string): Promise<any> {
    const aggregate = await this.repo.getAggregate(resultId);
    return aggregate?.explanationSnapshot || null;
  }

  public async getInsightsReadModel(resultId: string): Promise<any> {
    const aggregate = await this.repo.getAggregate(resultId);
    return aggregate?.insightSnapshot || null;
  }

  public async getRecommendationsReadModel(resultId: string): Promise<any> {
    const aggregate = await this.repo.getAggregate(resultId);
    return aggregate?.recommendationSnapshot || null;
  }

  public async getSectionsReadModel(resultId: string): Promise<any> {
    const aggregate = await this.repo.getAggregate(resultId);
    return aggregate?.sectionSnapshot || null;
  }

  public async getExportsReadModel(resultId: string): Promise<any> {
    return { availableFormats: ['PDF', 'JSON', 'PRINT'] };
  }
}
