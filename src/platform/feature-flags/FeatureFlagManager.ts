export type FlagLevel = 'Platform' | 'Domain' | 'Feature' | 'Capability';

export interface FeatureFlag {
  id: string;
  level: FlagLevel;
  parent?: string; // ID of the parent flag
  enabled: boolean;
}

export class FeatureFlagManager {
  private static instance: FeatureFlagManager;
  private flags: Map<string, FeatureFlag> = new Map();

  private constructor() {}

  public static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  public register(flag: FeatureFlag): void {
    this.flags.set(flag.id, flag);
  }

  public isEnabled(id: string): boolean {
    const flag = this.flags.get(id);
    if (!flag) return false;
    
    if (flag.parent) {
       const parentEnabled = this.isEnabled(flag.parent);
       if (!parentEnabled) return false;
    }
    return flag.enabled;
  }
}
