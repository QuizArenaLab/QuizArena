export interface RuntimeCapability {
  id: string;
  name: string;
  version: string;
  type: 'AI' | 'ACCESSIBILITY' | 'VOICE' | 'MOBILE_BRIDGE';
  initialize(context: any): Promise<void>;
}

export class RuntimeCapabilityRegistry {
  private capabilities: Map<string, RuntimeCapability> = new Map();

  public register(capability: RuntimeCapability): void {
    this.capabilities.set(capability.id, capability);
  }

  public getCapability(id: string): RuntimeCapability | undefined {
    return this.capabilities.get(id);
  }

  public getAll(): RuntimeCapability[] {
    return Array.from(this.capabilities.values());
  }
}
