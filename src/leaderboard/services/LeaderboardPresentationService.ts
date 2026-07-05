import { RankingAggregateRepository } from '../repositories/RankingAggregateRepository';
import { LeaderboardReadModelBuilder } from './builders/LeaderboardReadModelBuilder';
import { LeaderboardSummary, LeaderboardStatistics, LeaderboardCurrentUser, LeaderboardEntry } from '../models/LeaderboardReadModels';
import { RankingSnapshotRepository, CursorPaginationResult } from '../repositories/RankingSnapshotRepository';

export class LeaderboardPresentationService {
  constructor(
    private aggregateRepo: RankingAggregateRepository,
    private snapshotRepo: RankingSnapshotRepository,
    private builder: LeaderboardReadModelBuilder = new LeaderboardReadModelBuilder()
  ) {}

  public async getSummary(competitionId: string, scope: string): Promise<LeaderboardSummary | null> {
    const aggregate = await this.aggregateRepo.findLatestByCompetitionId(competitionId, scope);
    if (!aggregate) return null;

    return this.builder.buildSummary(aggregate);
  }

  public async getStatistics(competitionId: string, scope: string): Promise<LeaderboardStatistics | null> {
    const aggregate = await this.aggregateRepo.findLatestByCompetitionId(competitionId, scope);
    if (!aggregate) return null;

    return this.builder.buildStatistics(aggregate);
  }

  public async getCurrentUser(competitionId: string, scope: string, userId: string): Promise<LeaderboardCurrentUser | null> {
    const aggregate = await this.aggregateRepo.findLatestByCompetitionId(competitionId, scope);
    if (!aggregate) return null;

    return this.builder.buildCurrentUser(aggregate, userId);
  }

  public async getEntries(competitionId: string, scope: string, limit: number, cursor?: string): Promise<CursorPaginationResult<LeaderboardEntry>> {
    const aggregate = await this.aggregateRepo.findLatestByCompetitionId(competitionId, scope);
    if (!aggregate) {
      return { data: [], nextCursor: null, prevCursor: null, hasMore: false, totalCount: 0 };
    }

    const paginatedSnapshots = await this.snapshotRepo.findByAggregateIdWithCursor(aggregate.aggregateId, limit, cursor);
    
    return {
      ...paginatedSnapshots,
      data: paginatedSnapshots.data.map(s => this.builder.buildEntry(aggregate, s))
    };
  }
}
