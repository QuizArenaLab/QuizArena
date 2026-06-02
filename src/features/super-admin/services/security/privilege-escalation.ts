/**
 * QuizArena — SOC Privilege Escalation Detection
 *
 * Sovereign RBAC threat detection:
 * - Role escalation forensics from RoleChangeAudit
 * - RBAC bypass attempts from AuditLog
 * - Unauthorized admin access patterns
 * - Protected route abuse detection
 * - Governance override attempts
 *
 * Server-side only. SECURITY-CRITICAL infrastructure.
 *
 * Phase 7.7: Security Operations Center
 */

import { prisma } from "@/lib/prisma";
import type {
  PrivilegeEscalationData,
  EscalationEvent,
  RBACViolationEvent,
  SecurityActorIdentity,
  ThreatSeverity,
  SecurityEventType,
} from "@/types/super-admin-security";

function computeTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function deriveEscalationRisk(
  previousRole: string,
  newRole: string
): EscalationEvent["escalationRisk"] {
  if (newRole === "SUPER_ADMIN") return "CRITICAL";
  if (newRole === "ADMIN") return "HIGH";
  if (newRole === "MODERATOR") return "MEDIUM";
  return "LOW";
}

function deriveEscalationSeverity(
  escalationRisk: EscalationEvent["escalationRisk"]
): ThreatSeverity {
  switch (escalationRisk) {
    case "CRITICAL":
      return "SEVERE";
    case "HIGH":
      return "CRITICAL";
    case "MEDIUM":
      return "HIGH";
    default:
      return "MEDIUM";
  }
}

function classifyRBACEventType(action: string): SecurityEventType {
  const upper = action.toUpperCase();
  if (upper.includes("HIGH_RISK_BLOCKED")) return "HIGH_RISK_BLOCKED";
  if (upper.includes("UNAUTHORIZED") || upper.includes("DENIED")) return "UNAUTHORIZED_ACCESS";
  if (upper.includes("RBAC") || upper.includes("BYPASS")) return "RBAC_BYPASS";
  if (upper.includes("PERMISSION")) return "PERMISSION_FAILURE";
  if (upper.includes("ROLE_CHANGE") || upper.includes("PRIVILEGE")) return "PRIVILEGE_ESCALATION";
  if (upper.includes("GOVERNANCE") || upper.includes("BREACH")) return "GOVERNANCE_BREACH";
  return "PRIVILEGE_ESCALATION";
}

function mapRBACSeverity(dbSeverity: string): ThreatSeverity {
  switch (dbSeverity) {
    case "CRITICAL":
      return "CRITICAL";
    case "HIGH":
      return "HIGH";
    case "MEDIUM":
      return "MEDIUM";
    default:
      return "LOW";
  }
}

function parseMetadata(raw: unknown): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    if (typeof raw === "string") return JSON.parse(raw) as Record<string, unknown>;
    if (typeof raw === "object") return raw as Record<string, unknown>;
  } catch {
    return null;
  }
  return null;
}

export async function detectPrivilegeEscalation(): Promise<PrivilegeEscalationData> {
  const now = new Date();
  const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ago7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const actorSelect = { select: { id: true, name: true, email: true, role: true } } as const;

  const [
    recentRoleChangesRaw,
    rbacViolationsRaw,
    totalEscalations7d,
    totalRBACViolations7d,
    unauthorizedAccessAttempts24h,
    highRiskEscalations,
  ] = await Promise.all([
    // Recent role changes (last 7d) — ordered by most recent
    prisma.roleChangeAudit.findMany({
      where: { changedAt: { gte: ago7d } },
      orderBy: { changedAt: "desc" },
      take: 20,
      include: {
        targetUser: actorSelect,
        changedBy: actorSelect,
      },
    }),

    // RBAC violations from AuditLog (last 7d)
    prisma.auditLog.findMany({
      where: {
        createdAt: { gte: ago7d },
        OR: [
          { entityType: "ROLE", severity: { in: ["HIGH", "CRITICAL"] } },
          { action: { contains: "HIGH_RISK_BLOCKED", mode: "insensitive" } },
          { action: { contains: "UNAUTHORIZED", mode: "insensitive" } },
          { action: { contains: "RBAC", mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { actor: actorSelect },
    }),

    // Total escalations 7d
    prisma.roleChangeAudit.count({ where: { changedAt: { gte: ago7d } } }),

    // Total RBAC violations 7d
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago7d },
        entityType: "ROLE",
        severity: { in: ["HIGH", "CRITICAL"] },
      },
    }),

    // Unauthorized access attempts 24h
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago24h },
        OR: [
          { action: { contains: "UNAUTHORIZED", mode: "insensitive" } },
          { action: { contains: "HIGH_RISK_BLOCKED", mode: "insensitive" } },
          { action: { contains: "DENIED", mode: "insensitive" } },
        ],
      },
    }),

    // High-risk escalations (to ADMIN/SUPER_ADMIN) 7d
    prisma.roleChangeAudit.count({
      where: {
        changedAt: { gte: ago7d },
        newRole: { in: ["ADMIN", "SUPER_ADMIN"] },
      },
    }),
  ]);

  // Map role change audit records to EscalationEvent
  const recentEscalations: EscalationEvent[] = recentRoleChangesRaw.map((change) => {
    const escalationRisk = deriveEscalationRisk(change.previousRole, change.newRole);
    const severity = deriveEscalationSeverity(escalationRisk);

    const targetActor: SecurityActorIdentity = {
      id: change.targetUser.id,
      name: change.targetUser.name,
      email: change.targetUser.email,
      role: change.targetUser.role,
    };

    const initiatedBy: SecurityActorIdentity = {
      id: change.changedBy.id,
      name: change.changedBy.name,
      email: change.changedBy.email,
      role: change.changedBy.role,
    };

    return {
      id: change.id,
      action: `ROLE_CHANGE: ${change.previousRole} → ${change.newRole}`,
      targetActor,
      initiatedBy,
      previousRole: change.previousRole,
      newRole: change.newRole,
      severity,
      timestampISO: change.changedAt.toISOString(),
      timeAgo: computeTimeAgo(change.changedAt),
      isUnauthorized: false, // All logged role changes are authorized (by SUPER_ADMIN)
      escalationRisk,
    };
  });

  // Map RBAC violation events
  const rbacViolations: RBACViolationEvent[] = rbacViolationsRaw.map((entry) => {
    const meta = parseMetadata(entry.metadata);
    const eventType = classifyRBACEventType(entry.action);
    const severity = mapRBACSeverity(entry.severity);

    const actor: SecurityActorIdentity | null = entry.actor
      ? {
          id: entry.actor.id,
          name: entry.actor.name,
          email: entry.actor.email,
          role: entry.actor.role,
        }
      : null;

    return {
      id: entry.id,
      action: entry.action,
      actor,
      severity,
      eventType,
      timestampISO: entry.createdAt.toISOString(),
      timeAgo: computeTimeAgo(entry.createdAt),
      metadata: meta,
    };
  });

  // Determine escalation threat level
  let escalationThreatLevel: PrivilegeEscalationData["escalationThreatLevel"] = "LOW";
  if (highRiskEscalations > 3 || unauthorizedAccessAttempts24h > 10) {
    escalationThreatLevel = "CRITICAL";
  } else if (highRiskEscalations > 0 || totalRBACViolations7d > 5) {
    escalationThreatLevel = "HIGH";
  } else if (totalEscalations7d > 3 || totalRBACViolations7d > 0) {
    escalationThreatLevel = "ELEVATED";
  }

  return {
    recentEscalations,
    rbacViolations,
    totalEscalations7d,
    totalRBACViolations7d,
    unauthorizedAccessAttempts24h,
    highRiskEscalations,
    escalationThreatLevel,
  };
}
