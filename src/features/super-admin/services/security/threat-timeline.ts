/**
 * QuizArena — SOC Threat Timeline Engine
 *
 * Chronological threat reconstruction from the audit trail:
 * - Security events ordered by timestamp
 * - Threat progression mapping
 * - Infrastructure threats
 * - Governance abuse sequences
 *
 * Server-side only. Supports forensic investigations.
 *
 * Phase 7.7: Security Operations Center
 */

import { prisma } from "@/lib/prisma";
import type {
  ThreatTimeline,
  ThreatTimelineEntry,
  SecurityActorIdentity,
  ThreatSeverity,
  SecurityEventType,
  SOCFilter,
} from "@/types/super-admin-security";
import type { Prisma } from "@/generated/prisma";

const DEFAULT_LIMIT = 40;

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

function classifyThreatEventType(action: string, entityType: string): SecurityEventType {
  const upper = action.toUpperCase();
  const upperEntity = entityType.toUpperCase();

  if (upper.includes("HIGH_RISK_BLOCKED")) return "HIGH_RISK_BLOCKED";
  if (upper.includes("BRUTE_FORCE")) return "BRUTE_FORCE";
  if (upper.includes("AUTH_FAIL") || upper.includes("LOGIN_FAIL") || upper.includes("FAILED"))
    return "AUTH_FAILURE";
  if (upper.includes("ROLE_CHANGE") || upper.includes("PRIVILEGE_ESCALATION"))
    return "PRIVILEGE_ESCALATION";
  if (upper.includes("UNAUTHORIZED") || upper.includes("DENIED")) return "UNAUTHORIZED_ACCESS";
  if (upper.includes("RBAC") || upper.includes("BYPASS")) return "RBAC_BYPASS";
  if (upper.includes("SESSION") && upper.includes("STALE")) return "SESSION_ANOMALY";
  if (upper.includes("SESSION")) return "SESSION_ANOMALY";
  if (upper.includes("INFRASTRUCTURE") || upper.includes("INFRASTRUCTURE_CONFIG"))
    return "INFRASTRUCTURE_OVERRIDE";
  if (upper.includes("GOVERNANCE") || upper.includes("BREACH")) return "GOVERNANCE_BREACH";
  if (upper.includes("SUSPICIOUS") || upper.includes("ANOMAL")) return "SUSPICIOUS_PATTERN";
  if (upper.includes("PERMISSION")) return "PERMISSION_FAILURE";
  if (upperEntity === "SECURITY" || upperEntity === "AUTH") return "AUTH_FAILURE";
  if (upperEntity === "ROLE") return "PRIVILEGE_ESCALATION";

  return "CRITICAL_OPERATION";
}

function isSovereignThreat(action: string, metadata: Record<string, unknown> | null): boolean {
  const upper = action.toUpperCase();
  const sovereignPatterns = [
    "SUPER_ADMIN",
    "HIGH_RISK_INITIATED",
    "HIGH_RISK_COMPLETED",
    "HIGH_RISK_BLOCKED",
    "PLATFORM_SHUTDOWN",
    "MAINTENANCE_MODE",
    "DATA_PURGE",
    "FINANCIAL_OVERRIDE",
    "MASS_ROLE_CHANGE",
    "INFRASTRUCTURE_CONFIG",
  ];
  if (sovereignPatterns.some((p) => upper.includes(p))) return true;
  if (metadata?.actorRole === "SUPER_ADMIN") return true;
  return false;
}

function deriveInvestigationWorkflow(eventType: SecurityEventType): string {
  switch (eventType) {
    case "AUTH_FAILURE":
    case "BRUTE_FORCE":
      return "Open Authentication Forensics → Investigate login patterns";
    case "PRIVILEGE_ESCALATION":
      return "Open Privilege Escalation Panel → Review role change chain";
    case "RBAC_BYPASS":
    case "UNAUTHORIZED_ACCESS":
      return "Open Governance Investigation → Trace authorization bypass";
    case "SESSION_ANOMALY":
      return "Open Session Governance → Review active sessions";
    case "INFRASTRUCTURE_OVERRIDE":
      return "Open Infrastructure Panel → Verify configuration integrity";
    case "GOVERNANCE_BREACH":
      return "Open Compliance Center → Review governance audit trail";
    case "HIGH_RISK_BLOCKED":
      return "Open Security Forensics → Investigate blocked operation";
    case "SUSPICIOUS_PATTERN":
      return "Open Suspicious Activity Intelligence → Investigate actor";
    default:
      return "Open Security Operations Center → Investigate event chain";
  }
}

function mapDBSeverityToThreat(dbSeverity: string): ThreatSeverity {
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

function buildWhereClause(filter?: SOCFilter): Prisma.AuditLogWhereInput {
  const where: Prisma.AuditLogWhereInput = {
    // Only surface security-relevant events
    OR: [
      { severity: { in: ["HIGH", "CRITICAL"] } },
      { entityType: { in: ["AUTH", "SECURITY", "ROLE"] } },
      { action: { contains: "HIGH_RISK", mode: "insensitive" } },
      { action: { contains: "INFRASTRUCTURE", mode: "insensitive" } },
      { action: { contains: "UNAUTHORIZED", mode: "insensitive" } },
      { action: { contains: "BLOCKED", mode: "insensitive" } },
    ],
  };

  if (filter?.dateFrom || filter?.dateTo) {
    where.createdAt = {};
    if (filter.dateFrom) (where.createdAt as Prisma.DateTimeFilter).gte = filter.dateFrom;
    if (filter.dateTo) (where.createdAt as Prisma.DateTimeFilter).lte = filter.dateTo;
  }

  return where;
}

export async function getThreatTimeline(filter?: SOCFilter): Promise<ThreatTimeline> {
  const limit = filter?.limit ?? DEFAULT_LIMIT;
  const skip = filter?.page ? (filter.page - 1) * limit : 0;

  const where = buildWhereClause(filter);

  const actorSelect = { select: { id: true, name: true, email: true, role: true } } as const;

  const [entries, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      include: { actor: actorSelect },
    }),
    prisma.auditLog.count({ where }),
  ]);

  const mappedEntries: ThreatTimelineEntry[] = entries.map((entry) => {
    const meta = parseMetadata(entry.metadata);
    const eventType = classifyThreatEventType(entry.action, entry.entityType);
    const severity = mapDBSeverityToThreat(entry.severity);
    const sovereign = isSovereignThreat(entry.action, meta);

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
      entityType: entry.entityType,
      actor,
      severity,
      eventType,
      timestampISO: entry.createdAt.toISOString(),
      timeAgo: computeTimeAgo(entry.createdAt),
      ipAddress: entry.ipAddress,
      metadata: meta,
      isSovereignThreat: sovereign,
      investigationWorkflow: deriveInvestigationWorkflow(eventType),
    };
  });

  const timestamps = mappedEntries.map((e) => e.timestampISO);

  return {
    entries: mappedEntries,
    totalCount,
    filteredCount: mappedEntries.length,
    hasMore: totalCount > skip + limit,
    oldestTimestampISO: timestamps.length > 0 ? timestamps[timestamps.length - 1] : null,
    newestTimestampISO: timestamps.length > 0 ? timestamps[0] : null,
  };
}
