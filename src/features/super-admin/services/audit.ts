/**
 * QuizArena — Super Admin Audit Enforcement
 *
 * Sovereign audit logging for ALL super-admin operations.
 * SECURITY-CRITICAL: All SUPER_ADMIN actions MUST generate structured audit logs.
 *
 * Tracks: actor identity, action, infrastructure impact, metadata, timestamps, risk severity.
 * Future-ready for: persistent audit DB table, compliance exports, security intelligence.
 */

import { createAuditLog } from './audit/index';
import type { AuditSeverity } from "@/generated/prisma";
import type { Role } from "@/features/rbac/services/roles";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SuperAdminAuditCategory =
  | "AUTHENTICATION"
  | "ROLE_GOVERNANCE"
  | "FINANCIAL_CONTROL"
  | "INFRASTRUCTURE"
  | "SECURITY"
  | "COMPLIANCE"
  | "PLATFORM_CONTROLS"
  | "SESSION_MANAGEMENT"
  | "HIGH_RISK_ACTION"
  | "DATA_ACCESS"
  | "FEATURE_ROLLOUT";

export type RiskSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface SuperAdminAuditEvent {
  /** The Super Admin performing the action */
  actorId: string;
  actorRole: Role;
  actorEmail: string;
  /** Action descriptor */
  action: string;
  category: SuperAdminAuditCategory;
  /** Optional target (user/resource being acted upon) */
  targetId?: string;
  targetType?: string;
  /** Operational metadata */
  details?: Record<string, unknown>;
  riskSeverity: RiskSeverity;
  /** Infrastructure impact assessment */
  infrastructureImpact?: string;
  /** Timestamp */
  timestamp?: Date;
  /** Future: IP address, device fingerprint, session ID */
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export interface SuperAdminAuditResult {
  logged: boolean;
  eventId: string;
  timestamp: Date;
}

// ─── Audit Categories ────────────────────────────────────────────────────────

export const SUPER_ADMIN_AUDIT_CATEGORIES: Record<SuperAdminAuditCategory, string> = {
  AUTHENTICATION: "Super Admin authentication event",
  ROLE_GOVERNANCE: "Role assignment / revocation",
  FINANCIAL_CONTROL: "Financial system access / operation",
  INFRASTRUCTURE: "Infrastructure configuration / operation",
  SECURITY: "Security event / threat response",
  COMPLIANCE: "Compliance / audit operation",
  PLATFORM_CONTROLS: "Platform feature / flag control",
  SESSION_MANAGEMENT: "Session validation / hardening",
  HIGH_RISK_ACTION: "High-risk operational action",
  DATA_ACCESS: "Sensitive data access",
  FEATURE_ROLLOUT: "Feature rollout / governance action",
} as const;

// ─── Risk Severity Labels ────────────────────────────────────────────────────

export const RISK_SEVERITY_LABELS: Record<RiskSeverity, string> = {
  CRITICAL: "CRITICAL — Platform-wide impact, irreversible",
  HIGH: "HIGH — Significant operational impact",
  MEDIUM: "MEDIUM — Moderate impact, reversible",
  LOW: "LOW — Informational, minimal impact",
} as const;

const mapSeverity = (severity: RiskSeverity): AuditSeverity => {
  return severity as AuditSeverity;
};

// ─── Core Audit Logging ───────────────────────────────────────────────────────

/**
 * Primary audit logger for all super-admin actions.
 * Wraps the centralized audit infrastructure to maintain compatibility.
 */
export const logSuperAdminAudit = async (
  event: SuperAdminAuditEvent
): Promise<SuperAdminAuditResult> => {
  const timestamp = event.timestamp ?? new Date();

  const auditLog = await createAuditLog({
    action: event.action,
    entityType: "SYSTEM", // Defaulting to SYSTEM for SA operations
    actorId: event.actorId,
    targetUserId: event.targetType === "USER" ? event.targetId : undefined,
    entityId: event.targetType !== "USER" ? event.targetId : undefined,
    severity: mapSeverity(event.riskSeverity),
    metadata: {
      category: event.category,
      categoryLabel: SUPER_ADMIN_AUDIT_CATEGORIES[event.category],
      actorRole: event.actorRole,
      actorEmail: event.actorEmail,
      infrastructureImpact: event.infrastructureImpact,
      details: event.details,
      sessionId: event.sessionId,
    },
  });

  // Structured console output for server-side log aggregation
  const prefix = `[SUPER_ADMIN:${event.riskSeverity}:${event.category}]`;
  console.log(`${prefix} ${event.action}`, auditLog);

  return {
    logged: true,
    eventId: auditLog.id,
    timestamp,
  };
};

// ─── Specialized Audit Helpers ────────────────────────────────────────────────

export const auditSuperAdminLogin = async (
  actorId: string,
  actorRole: Role,
  actorEmail: string
): Promise<void> => {
  await logSuperAdminAudit({
    actorId,
    actorRole,
    actorEmail,
    action: "SUPER_ADMIN_SESSION_ESTABLISHED",
    category: "AUTHENTICATION",
    riskSeverity: "MEDIUM",
    infrastructureImpact: "None — session creation only",
    timestamp: new Date(),
  });
};

export const auditRoleGovernance = async (
  actorId: string,
  actorRole: Role,
  actorEmail: string,
  targetUserId: string,
  oldRole: string,
  newRole: string,
  reason?: string
): Promise<void> => {
  await logSuperAdminAudit({
    actorId,
    actorRole,
    actorEmail,
    action: `ROLE_CHANGE: ${oldRole} → ${newRole}`,
    category: "ROLE_GOVERNANCE",
    targetId: targetUserId,
    targetType: "USER",
    riskSeverity: newRole === "SUPER_ADMIN" || newRole === "ADMIN" ? "CRITICAL" : "HIGH",
    infrastructureImpact: `User privilege changed from ${oldRole} to ${newRole}`,
    details: { oldRole, newRole, reason },
    timestamp: new Date(),
  });
};

export const auditHighRiskAction = async (
  actorId: string,
  actorRole: Role,
  actorEmail: string,
  action: string,
  impact: string,
  details?: Record<string, unknown>
): Promise<void> => {
  await logSuperAdminAudit({
    actorId,
    actorRole,
    actorEmail,
    action,
    category: "HIGH_RISK_ACTION",
    riskSeverity: "CRITICAL",
    infrastructureImpact: impact,
    details,
    timestamp: new Date(),
  });
};

export const auditFinancialAccess = async (
  actorId: string,
  actorRole: Role,
  actorEmail: string,
  operation: string,
  details?: Record<string, unknown>
): Promise<void> => {
  await logSuperAdminAudit({
    actorId,
    actorRole,
    actorEmail,
    action: `FINANCIAL_ACCESS: ${operation}`,
    category: "FINANCIAL_CONTROL",
    riskSeverity: "HIGH",
    infrastructureImpact: "Financial system accessed",
    details,
    timestamp: new Date(),
  });
};

export const auditInfrastructureAction = async (
  actorId: string,
  actorRole: Role,
  actorEmail: string,
  operation: string,
  impact: string,
  details?: Record<string, unknown>
): Promise<void> => {
  await logSuperAdminAudit({
    actorId,
    actorRole,
    actorEmail,
    action: `INFRASTRUCTURE: ${operation}`,
    category: "INFRASTRUCTURE",
    riskSeverity: "CRITICAL",
    infrastructureImpact: impact,
    details,
    timestamp: new Date(),
  });
};

// ─── Utility ─────────────────────────────────────────────────────────────────
