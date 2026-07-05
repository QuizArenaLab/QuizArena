export interface ResultsCapability {
  id: string;
  name: string;
  version: string;
  type: 'AI_ANALYSIS' | 'COACH' | 'MENTOR' | 'ACCESSIBILITY' | 'TRANSLATION';
  initialize(context: any): Promise<void>;
}

export class ResultsCapabilityRegistry {
  private capabilities: Map<string, ResultsCapability> = new Map();

  public register(capability: ResultsCapability): void {
    this.capabilities.set(capability.id, capability);
  }

  public getCapability(id: string): ResultsCapability | undefined {
    return this.capabilities.get(id);
  }

  public getAll(): ResultsCapability[] {
    return Array.from(this.capabilities.values());
  }
}
