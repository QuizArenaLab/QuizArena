/**
 * Explorer Cache
 * 
 * In-memory cache for Recent Searches, Search Results, Previews, Recommendations, and Filter Metadata.
 * Includes intelligent invalidation strategies.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ExplorerCacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_TTL = 1000 * 60 * 5; // 5 minutes

  set<T>(key: string, data: T) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get<T>(key: string, ttl: number = this.DEFAULT_TTL): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  invalidate(keyPattern: RegExp | string) {
    if (typeof keyPattern === 'string') {
      this.cache.delete(keyPattern);
    } else {
      for (const key of this.cache.keys()) {
        if (keyPattern.test(key)) {
          this.cache.delete(key);
        }
      }
    }
  }

  clearAll() {
    this.cache.clear();
  }
}

export const ExplorerCache = new ExplorerCacheService();
