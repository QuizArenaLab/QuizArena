/**
 * QuizArena — Security & Authorization Forensics
 *
 * Builds forensic security intelligence from audit trail:
 * - CRITICAL/HIGH severity events (last 7 days)
 * - Authentication failures and session anomalies
 * - RBAC violations and role escalation attempts
 * - Infrastructure override events
 *
 * Server-side only — SUPER_ADMIN forensic infrastructure.
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import { prisma } from "@/lib/prisma";
import type {
  SecurityForensicsData,
  SecurityForensicEvent,
  GovernanceActorIdentity,
  DbAuditSeverity,
} from "@/types/super-admin-compliance";
import {
  mapToComplianceSeverity,
  isSovereignAction,
  classifySecurityEventType,
  computeTimeAgo,
} from "./utils";

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

function mapToForensicEvent(entry: {
  id: string;
  action: string;
  entityType: string;
  severity: string;
  createdAt: Date;
  ipAddress: string | null;
  metadata: unknown;
  actor: { id: string; name: string | null; email: string | null; role: string } | null;
}): SecurityForensicEvent {
  const meta = parseMetadata(entry.metadata);
  const dbSeverity = entry.severity as DbAuditSeverity;
  const isSovereign = isSovereignAction(entry.action, meta);
  const complianceSeverity = mapToComplianceSeverity(dbSeverity, isSovereign);

  const actor: GovernanceActorIdentity | null = entry.actor
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
    severity: complianceSeverity,
    timestamp: entry.createdAt,
    timestampISO: entry.createdAt.toISOString(),
    timeAgo: computeTimeAgo(entry.createdAt),
    ipAddress: entry.ipAddress,
    metadata: meta,
    securityEventType: classifySecurityEventType(entry.action),
  };
}

export async function getSecurityForensics(): Promise<SecurityForensicsData> {
  const now = new Date();
  const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ago7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const actorSelect = {
    select: { id: true, name: true, email: true, role: true },
  } as const;

  const [
    recentCriticalRaw,
    authEventsRaw,
    rbacEventsRaw,
    infraEventsRaw,
    totalCritical7d,
    totalHigh7d,
    authFailures24h,
    rbacViolations7d,
  ] = await Promise.all([
    // Recent CRITICAL events (last 7d)
    prisma.auditLog.findMany({
      where: {
        createdAt: { gte: ago7d },
        severity: { in: ["CRITICAL", "HIGH"] },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { actor: actorSelect },
    }),

    // Auth / session events
    prisma.auditLog.findMany({
      where: {
        createdAt: { gte: ago7d },
        entityType: { in: ["AUTH", "SECURITY"] },
      },
      orderBy: { createdAt: "desc" },
      take: 15,
      include: { actor: actorSelect },
    }),

    // RBAC / role escalation events
    prisma.auditLog.findMany({
      where: {
        createdAt: { gte: ago7d },
        entityType: "ROLE",
      },
      orderBy: { createdAt: "desc" },
      take: 15,
      include: { actor: actorSelect },
    }),

    // Infrastructure events
    prisma.auditLog.findMany({
      where: {
        createdAt: { gte: ago7d },
        action: { contains: "INFRASTRUCTURE", mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { actor: actorSelect },
    }),

    // Count CRITICAL in last 7d
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago7d },
        severity: "CRITICAL",
      },
    }),

    // Count HIGH in last 7d
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago7d },
        severity: "HIGH",
      },
    }),

    // Auth failures in last 24h
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago24h },
        entityType: { in: ["AUTH", "SECURITY"] },
      },
    }),

    // RBAC violations in last 7d
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago7d },
        entityType: "ROLE",
        severity: { in: ["HIGH", "CRITICAL"] },
      },
    }),
  ]);

  // Determine threat level
  let threatLevel: SecurityForensicsData["threatLevel"] = "LOW";
  if (totalCritical7d > 20 || authFailures24h > 50) {
    threatLevel = "CRITICAL";
  } else if (totalCritical7d > 10 || authFailures24h > 20) {
    threatLevel = "HIGH";
  } else if (totalCritical7d > 0 || authFailures24h > 5 || rbacViolations7d > 3) {
    threatLevel = "ELEVATED";
  }

  return {
    recentCriticalEvents: recentCriticalRaw.map(mapToForensicEvent),
    authEvents: authEventsRaw.map(mapToForensicEvent),
    rbacEvents: rbacEventsRaw.map(mapToForensicEvent),
    infrastructureEvents: infraEventsRaw.map(mapToForensicEvent),
    totalCritical7d,
    totalHigh7d,
    authFailures24h,
    rbacViolations7d,
    threatLevel,
  };
}
