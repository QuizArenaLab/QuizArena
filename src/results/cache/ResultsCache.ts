import { ResultsReadModel } from '../models/ResultsReadModel';

export interface ResultsCache {
  /**
   * Retrieves the pre-computed ResultsReadModel for high-performance rendering.
   */
  getReadModel(resultId: string): Promise<ResultsReadModel | null>;
  setReadModel(resultId: string, model: ResultsReadModel): Promise<void>;
  invalidate(resultId: string): Promise<void>;
}
