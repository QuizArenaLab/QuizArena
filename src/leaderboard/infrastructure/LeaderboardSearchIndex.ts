import { LeaderboardEntry } from '../models/LeaderboardReadModels';

export interface LeaderboardSearchIndex {
  index(competitionId: string, entry: LeaderboardEntry): Promise<void>;
  search(competitionId: string, query: string): Promise<LeaderboardEntry[]>;
}

export class InMemoryLeaderboardSearchIndex implements LeaderboardSearchIndex {
  // key: competitionId, value: map of userId -> entry
  private indices = new Map<string, Map<string, LeaderboardEntry>>();

  public async index(competitionId: string, entry: LeaderboardEntry): Promise<void> {
    if (!this.indices.has(competitionId)) {
      this.indices.set(competitionId, new Map());
    }
    
    const compIndex = this.indices.get(competitionId)!;
    compIndex.set(entry.userId, entry);
  }

  public async search(competitionId: string, query: string): Promise<LeaderboardEntry[]> {
    const compIndex = this.indices.get(competitionId);
    if (!compIndex) return [];

    const lowerQuery = query.toLowerCase();
    const results: LeaderboardEntry[] = [];

    for (const entry of compIndex.values()) {
      // Basic search on username or exact match on userId/rank
      if (
        entry.username.toLowerCase().includes(lowerQuery) || 
        entry.userId.toLowerCase() === lowerQuery ||
        entry.rank.toString() === query
      ) {
        results.push(entry);
      }
    }

    return results;
  }
}
