/**
 * QuizArena — Centralized Enterprise Audit Infrastructure
 *
 * Core service for generating immutable, structured audit logs for governance,
 * security, and operational intelligence. This system relies on a strictly
 * type-safe Prisma schema (`AuditLog`) for persistence.
 */

import { prisma } from "@/lib/prisma";
import type { Role } from "@/features/rbac/services/roles";
import { headers } from "next/headers";
import { AuditSeverity, AuditEntityType } from "@/generated/prisma";

// Ensure our generated prisma enum maps correctly
export type { AuditSeverity, AuditEntityType };

export interface AuditLogParams {
  action: string;
  entityType: AuditEntityType;
  entityId?: string;
  actorId?: string;
  targetUserId?: string;
  metadata?: Record<string, unknown>;
  severity?: AuditSeverity;
}

/**
 * Creates an immutable audit log directly in the database.
 * Automatically injects IP address and User Agent from headers.
 */
export async function createAuditLog(params: AuditLogParams) {
  let ipAddress = "unknown";
  let userAgent = "unknown";

  try {
    const headersList = await headers();
    ipAddress = headersList.get("x-forwarded-for") || "unknown";
    userAgent = headersList.get("user-agent") || "unknown";
  } catch {
    // If not running in a request context, safely fallback
  }

  return prisma.auditLog.create({
    data: {
      ...params,
      severity: params.severity || "LOW",
      metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
      ipAddress,
      userAgent,
    },
  });
}

// ─── Governance Utilities ───────────────────────────────────────────────────

export async function logRoleChange(
  actorId: string,
  targetUserId: string,
  oldRole: Role,
  newRole: Role,
  reason?: string
) {
  const severity = newRole === "SUPER_ADMIN" || newRole === "ADMIN" ? "CRITICAL" : "HIGH";

  return createAuditLog({
    action: `ROLE_CHANGE: ${oldRole} → ${newRole}`,
    entityType: "ROLE",
    entityId: targetUserId,
    actorId,
    targetUserId,
    severity,
    metadata: { oldRole, newRole, reason },
  });
}

export async function logModerationAction(
  actorId: string,
  targetUserId: string,
  action: string,
  reason: string
) {
  let severity: AuditSeverity = "MEDIUM";
  if (action === "SUSPEND" || action === "BAN") {
    severity = "HIGH";
  }

  return createAuditLog({
    action: `MODERATION: ${action}`,
    entityType: "MODERATION",
    entityId: targetUserId,
    actorId,
    targetUserId,
    severity,
    metadata: { action, reason },
  });
}

export async function logSecurityEvent(
  action: string,
  severity: AuditSeverity,
  actorId?: string,
  metadata?: Record<string, unknown>
) {
  return createAuditLog({
    action,
    entityType: "SECURITY",
    actorId,
    severity,
    metadata,
  });
}

export async function logSystemEvent(
  action: string,
  severity: AuditSeverity = "LOW",
  metadata?: Record<string, unknown>
) {
  return createAuditLog({
    action,
    entityType: "SYSTEM",
    severity,
    metadata,
  });
}

export async function logSuperAdminAction(
  actorId: string,
  action: string,
  impact: string,
  metadata?: Record<string, unknown>
) {
  return createAuditLog({
    action,
    entityType: "SYSTEM", // or potentially a new type if we expand
    actorId,
    severity: "CRITICAL",
    metadata: { impact, ...metadata },
  });
}
