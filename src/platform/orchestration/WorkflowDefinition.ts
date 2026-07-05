export interface WorkflowDefinition {
  id: string;
  name: string;
  version: string;
  states: string[];
  transitions: Record<string, string[]>;
  timeoutMs?: number;
  retries: number;
  compensationRules: Record<string, string>; // State -> Compensation Action
}

export class WorkflowTimeline {
  private events: Array<{ state: string, timestamp: Date, metadata?: any }> = [];

  public record(state: string, metadata?: any): void {
    this.events.push({ state, timestamp: new Date(), metadata });
  }

  public getHistory() {
    return [...this.events];
  }
}
