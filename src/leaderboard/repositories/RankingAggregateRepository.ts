import { RankingAggregate } from '../models/RankingAggregate';

export interface RankingAggregateRepository {
  save(aggregate: RankingAggregate): Promise<void>;
  findById(aggregateId: string): Promise<RankingAggregate | null>;
  findLatestByCompetitionId(competitionId: string, scope: string): Promise<RankingAggregate | null>;
}

export class InMemoryRankingAggregateRepository implements RankingAggregateRepository {
  private aggregates = new Map<string, RankingAggregate>();
  private latestByCompetition = new Map<string, string>(); // key: competitionId_scope -> aggregateId

  public async save(aggregate: RankingAggregate): Promise<void> {
    this.aggregates.set(aggregate.aggregateId, aggregate);
    this.latestByCompetition.set(`${aggregate.competitionId}_${aggregate.leaderboardScope}`, aggregate.aggregateId);
  }

  public async findById(aggregateId: string): Promise<RankingAggregate | null> {
    return this.aggregates.get(aggregateId) || null;
  }

  public async findLatestByCompetitionId(competitionId: string, scope: string): Promise<RankingAggregate | null> {
    const aggregateId = this.latestByCompetition.get(`${competitionId}_${scope}`);
    if (aggregateId) {
      return this.aggregates.get(aggregateId) || null;
    }
    return null;
  }
}
