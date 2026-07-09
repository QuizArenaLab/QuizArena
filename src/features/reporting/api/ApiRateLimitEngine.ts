export class ApiRateLimitEngine {
  public checkLimit(apiKeyId: string): boolean {
    return true; // Not rate limited
  }
}
