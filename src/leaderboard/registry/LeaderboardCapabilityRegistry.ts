export interface LeaderboardCapability {
  id: string;
  name: string;
  description: string;
  version: string;
}

export class LeaderboardCapabilityRegistry {
  private capabilities = new Map<string, LeaderboardCapability>();

  public register(capability: LeaderboardCapability): void {
    this.capabilities.set(capability.id, capability);
  }

  public get(id: string): LeaderboardCapability | undefined {
    return this.capabilities.get(id);
  }

  public listAll(): LeaderboardCapability[] {
    return Array.from(this.capabilities.values());
  }
}
