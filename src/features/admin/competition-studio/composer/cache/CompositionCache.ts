/**
 * Composition Cache
 * 
 * In-memory cache for Section Metadata, Question Blocks, Selection State, Analytics, and Snapshots.
 */

class CompositionCacheService {
  private cache: Map<string, any> = new Map();

  set(key: string, data: any) {
    this.cache.set(key, data);
  }

  get<T>(key: string): T | null {
    return this.cache.get(key) || null;
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

export const CompositionCache = new CompositionCacheService();
