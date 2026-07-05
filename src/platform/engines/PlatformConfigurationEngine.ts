export interface PolicyConfig {
  retryCount: number;
  timeoutMs: number;
  concurrency: number;
  batchSize: number;
}

export class PlatformConfigurationEngine {
  private featureFlags = new Map<string, boolean>();
  private policies = new Map<string, PolicyConfig>();

  public setFeatureFlag(flag: string, enabled: boolean): void {
    this.featureFlags.set(flag, enabled);
  }

  public isFeatureEnabled(flag: string): boolean {
    return this.featureFlags.get(flag) ?? false;
  }

  public setPolicy(name: string, config: PolicyConfig): void {
    this.policies.set(name, config);
  }

  public getPolicy(name: string): PolicyConfig {
    return this.policies.get(name) || {
      retryCount: 3,
      timeoutMs: 5000,
      concurrency: 1,
      batchSize: 100
    };
  }

  public getSnapshot(): any {
    return {
      features: Object.fromEntries(this.featureFlags),
      policies: Object.fromEntries(this.policies)
    };
  }
}
