import { LeaderboardAudit } from '../models/RankingSnapshots';

export interface LeaderboardAuditRepository {
  save(audit: LeaderboardAudit): Promise<void>;
  findByAggregateId(aggregateId: string): Promise<LeaderboardAudit[]>;
}

export class InMemoryLeaderboardAuditRepository implements LeaderboardAuditRepository {
  private audits = new Map<string, LeaderboardAudit[]>();

  public async save(audit: LeaderboardAudit): Promise<void> {
    // In a real system, you'd tie it to aggregate ID, here we just store flat
    const existing = this.audits.get('global') || [];
    existing.push(audit);
    this.audits.set('global', existing);
  }

  public async findByAggregateId(aggregateId: string): Promise<LeaderboardAudit[]> {
    // Implementation for MVP placeholder
    return this.audits.get('global') || [];
  }
}
