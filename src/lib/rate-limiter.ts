/**
 * In-memory rate limiter for basic brute-force protection.
 *
 * WARNING: This is a minimal implementation for development.
 * For production, use a distributed store like Redis with Upstash.
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Check if a key (e.g., IP or email) is rate limited
   * @returns {isLimited: boolean, remaining: number, resetAt: number | null}
   */
  check(key: string): { isLimited: boolean; remaining: number; resetAt: number | null } {
    const now = Date.now();
    const attempts = this.attempts.get(key) ?? [];

    // Clean up old attempts outside the time window
    const validAttempts = attempts.filter((timestamp) => now - timestamp < this.windowMs);

    if (validAttempts.length >= this.maxAttempts) {
      const oldest = validAttempts[0];
      const resetAt = oldest + this.windowMs;
      return { isLimited: true, remaining: 0, resetAt };
    }

    return {
      isLimited: false,
      remaining: this.maxAttempts - validAttempts.length,
      resetAt: null,
    };
  }

  /**
   * Register an attempt for a key
   */
  register(key: string): void {
    const now = Date.now();
    const attempts = this.attempts.get(key) ?? [];
    attempts.push(now);
    this.attempts.set(key, attempts);
  }

  /**
   * Reset attempts for a key (e.g., after successful auth)
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clean up old entries to prevent memory leaks
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, attempts] of this.attempts.entries()) {
      const valid = attempts.filter((t) => now - t < this.windowMs);
      if (valid.length === 0) {
        this.attempts.delete(key);
      } else {
        this.attempts.set(key, valid);
      }
    }
  }
}

// Singleton instances
export const signupRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 min
export const loginRateLimiter = new RateLimiter(10, 15 * 60 * 1000); // 10 attempts per 15 min

// Periodic cleanup to prevent memory leaks
setInterval(
  () => {
    signupRateLimiter.cleanup();
    loginRateLimiter.cleanup();
  },
  5 * 60 * 1000
); // Every 5 minutes
