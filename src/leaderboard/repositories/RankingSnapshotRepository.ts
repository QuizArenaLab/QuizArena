import { RankingSnapshot } from '../models/RankingSnapshots';

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: string | null;
  prevCursor: string | null;
  hasMore: boolean;
  totalCount: number;
}

export interface RankingSnapshotRepository {
  saveAll(aggregateId: string, snapshots: RankingSnapshot[]): Promise<void>;
  findByAggregateIdWithCursor(aggregateId: string, limit: number, cursor?: string): Promise<CursorPaginationResult<RankingSnapshot>>;
  findByUserId(aggregateId: string, userId: string): Promise<RankingSnapshot | null>;
}

export class InMemoryRankingSnapshotRepository implements RankingSnapshotRepository {
  private store = new Map<string, RankingSnapshot[]>(); // key: aggregateId

  public async saveAll(aggregateId: string, snapshots: RankingSnapshot[]): Promise<void> {
    this.store.set(aggregateId, snapshots);
  }

  public async findByAggregateIdWithCursor(aggregateId: string, limit: number, cursor?: string): Promise<CursorPaginationResult<RankingSnapshot>> {
    const snapshots = this.store.get(aggregateId) || [];
    
    // Simple cursor implementation based on index for MVP
    const startIndex = cursor ? parseInt(cursor, 10) : 0;
    const data = snapshots.slice(startIndex, startIndex + limit);
    
    const hasMore = startIndex + limit < snapshots.length;
    const nextCursor = hasMore ? (startIndex + limit).toString() : null;
    const prevCursor = startIndex > 0 ? Math.max(0, startIndex - limit).toString() : null;

    return {
      data,
      nextCursor,
      prevCursor,
      hasMore,
      totalCount: snapshots.length
    };
  }

  public async findByUserId(aggregateId: string, userId: string): Promise<RankingSnapshot | null> {
    const snapshots = this.store.get(aggregateId) || [];
    return snapshots.find(s => s.candidate.userId === userId) || null;
  }
}
