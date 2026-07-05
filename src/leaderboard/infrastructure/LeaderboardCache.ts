import { RankingAggregate } from '../models/RankingAggregate';

export interface LeaderboardCache {
  get(key: string): Promise<any | null>;
  set(key: string, value: any, ttlSeconds?: number): Promise<void>;
  invalidate(key: string): Promise<void>;
}

export class InMemoryLeaderboardCache implements LeaderboardCache {
  private cache = new Map<string, { value: any, expiresAt: number | null }>();

  public async get(key: string): Promise<any | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (item.expiresAt !== null && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  public async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : null;
    this.cache.set(key, { value, expiresAt });
  }

  public async invalidate(key: string): Promise<void> {
    this.cache.delete(key);
  }
}
