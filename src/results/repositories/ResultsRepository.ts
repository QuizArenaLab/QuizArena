import { ResultAggregate } from '../models/ResultAggregate';

export interface ResultsRepository {
  /**
   * Persists the canonical ResultAggregate.
   */
  saveAggregate(aggregate: ResultAggregate): Promise<void>;
  getAggregate(resultId: string): Promise<ResultAggregate | null>;
}
