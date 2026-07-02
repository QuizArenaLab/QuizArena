export class CapabilityRegistry {
  private static instance: CapabilityRegistry;
  private capabilities: Map<string, string[]> = new Map(); // Domain -> capabilities[]

  private constructor() {}

  public static getInstance(): CapabilityRegistry {
    if (!CapabilityRegistry.instance) {
      CapabilityRegistry.instance = new CapabilityRegistry();
    }
    return CapabilityRegistry.instance;
  }

  public register(domain: string, capability: string): void {
    const caps = this.capabilities.get(domain) || [];
    if (!caps.includes(capability)) {
      caps.push(capability);
      this.capabilities.set(domain, caps);
    }
  }

  public getCapabilities(domain: string): string[] {
    return this.capabilities.get(domain) || [];
  }
}
