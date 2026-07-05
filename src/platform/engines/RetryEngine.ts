export type RetryStrategy = 'IMMEDIATE' | 'LINEAR' | 'EXPONENTIAL';

export interface RetryPolicy {
  maxAttempts: number;
  strategy: RetryStrategy;
  baseDelayMs: number;
}

export class RetryEngine {
  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    policy: RetryPolicy
  ): Promise<T> {
    let attempt = 0;
    
    while (attempt < policy.maxAttempts) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        if (attempt >= policy.maxAttempts) {
          throw error;
        }
        
        const delay = this.calculateDelay(policy, attempt);
        console.warn(`Operation failed, retrying in ${delay}ms (Attempt ${attempt}/${policy.maxAttempts})`);
        await this.sleep(delay);
      }
    }
    
    throw new Error('Unreachable code');
  }

  private calculateDelay(policy: RetryPolicy, attempt: number): number {
    switch (policy.strategy) {
      case 'IMMEDIATE': return 0;
      case 'LINEAR': return policy.baseDelayMs * attempt;
      case 'EXPONENTIAL': return policy.baseDelayMs * Math.pow(2, attempt - 1);
      default: return policy.baseDelayMs;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
