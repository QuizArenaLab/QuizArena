export interface AuditEntry {
  id: string;
  action: string;
  actorId: string | null;
  actorName?: string;
  previousState?: string;
  newState?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CreateAuditEntryOptions {
  competitionId: string;
  action: string;
  actorId: string;
  previousState?: string;
  newState?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}
