export class ProviderRegistry {
  private static instance: ProviderRegistry;
  private providers: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  public register<T>(name: string, provider: T): void {
    if (this.providers.has(name)) {
      throw new Error(`Provider ${name} is already registered.`);
    }
    this.providers.set(name, provider);
  }

  public get<T>(name: string): T {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Provider ${name} not found.`);
    }
    return provider as T;
  }

  public clear(): void {
    this.providers.clear();
  }
}
