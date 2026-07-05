export interface MetricPoint {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: Date;
}

export class MetricsEngine {
  private metrics: MetricPoint[] = [];

  public record(name: string, value: number, tags: Record<string, string> = {}): void {
    this.metrics.push({
      name,
      value,
      tags,
      timestamp: new Date()
    });
    // In production, this flushes to Prometheus, Datadog, etc.
  }

  public getSnapshot(): MetricPoint[] {
    return [...this.metrics];
  }
}
