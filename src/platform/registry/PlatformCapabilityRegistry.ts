export interface CapabilityDefinition {
  id: string;
  name: string;
  providerDomain: string;
  version: string;
  description: string;
}

export class PlatformCapabilityRegistry {
  private capabilities = new Map<string, CapabilityDefinition>();

  public register(capability: CapabilityDefinition): void {
    if (this.capabilities.has(capability.id)) {
      throw new Error(`Capability ${capability.id} is already registered.`);
    }
    this.capabilities.set(capability.id, capability);
  }

  public get(id: string): CapabilityDefinition | undefined {
    return this.capabilities.get(id);
  }

  public listByDomain(domain: string): CapabilityDefinition[] {
    return Array.from(this.capabilities.values()).filter(c => c.providerDomain === domain);
  }
}
