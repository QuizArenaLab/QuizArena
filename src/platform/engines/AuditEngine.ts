import { PlatformEventBus, PlatformEvent } from '../events/PlatformEventBus';

export interface PlatformAudit {
  auditId: string;
  domain: string;
  action: string;
  actor: string;
  timestamp: Date;
  details: any;
}

export class AuditEngine {
  private auditLog: PlatformAudit[] = [];

  constructor(private eventBus: PlatformEventBus) {
    this.eventBus.subscribe('DomainAuditEvent', this.handleDomainAudit.bind(this));
  }

  private async handleDomainAudit(event: PlatformEvent): Promise<void> {
    const audit: PlatformAudit = {
      auditId: event.eventId,
      domain: event.producer,
      action: event.payload.action,
      actor: event.payload.actor,
      timestamp: event.occurredAt,
      details: event.payload.details
    };
    
    this.auditLog.push(audit);
    // In production, persist to cold storage or specific audit DB
  }

  public getHistory(): PlatformAudit[] {
    return [...this.auditLog];
  }
}
