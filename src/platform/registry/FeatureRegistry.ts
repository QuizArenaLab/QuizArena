export class FeatureRegistry {
  private static instance: FeatureRegistry;
  private features: Map<string, boolean> = new Map();

  private constructor() {}

  public static getInstance(): FeatureRegistry {
    if (!FeatureRegistry.instance) {
      FeatureRegistry.instance = new FeatureRegistry();
    }
    return FeatureRegistry.instance;
  }

  public enableFeature(name: string): void {
    this.features.set(name, true);
  }

  public disableFeature(name: string): void {
    this.features.set(name, false);
  }

  public isEnabled(name: string): boolean {
    return !!this.features.get(name);
  }

  public clear(): void {
    this.features.clear();
  }
}
