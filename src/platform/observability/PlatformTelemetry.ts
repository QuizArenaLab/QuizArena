import { randomUUID } from 'crypto';

export interface TelemetrySpan {
  spanId: string;
  traceId: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  tags: Record<string, string>;
}

export class PlatformTelemetry {
  private spans = new Map<string, TelemetrySpan>();

  public startSpan(name: string, traceId: string = randomUUID(), tags: Record<string, string> = {}): TelemetrySpan {
    const span: TelemetrySpan = {
      spanId: randomUUID(),
      traceId,
      name,
      startTime: new Date(),
      tags
    };
    
    this.spans.set(span.spanId, span);
    return span;
  }

  public endSpan(spanId: string, extraTags: Record<string, string> = {}): void {
    const span = this.spans.get(spanId);
    if (!span) return;
    
    span.endTime = new Date();
    span.tags = { ...span.tags, ...extraTags };
    this.spans.set(spanId, span);
    
    // In production, export this span to OpenTelemetry / Jaeger / Datadog
    console.log(`[Telemetry] Span ${span.name} completed in ${span.endTime.getTime() - span.startTime.getTime()}ms`);
  }
}
