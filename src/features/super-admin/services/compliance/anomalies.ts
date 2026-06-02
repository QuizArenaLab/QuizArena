/**
 * QuizArena — Governance Anomaly Detection Engine
 *
 * Proactive institutional risk detection:
 * - Repeated CRITICAL events from same actor
 * - Role escalation spikes
 * - Infrastructure override clusters
 * - Unusual governance volumes
 * - Suspicious auth patterns
 * - Rapid setting changes
 *
 * Server-side only — forensic intelligence layer.
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import { prisma } from "@/lib/prisma";
import type {
  GovernanceAnomaly,
  GovernanceActorIdentity,
  AnomalyType,
  ComplianceSeverity,
} from "@/types/super-admin-compliance";

function generateAnomalyId(type: AnomalyType, actorId?: string | null): string {
  return `anomaly-${type}-${actorId ?? "global"}-${Date.now()}`;
}

function buildAnomaly(
  type: AnomalyType,
  title: string,
  description: string,
  severity: ComplianceSeverity,
  actor: GovernanceActorIdentity | null,
  eventCount: number,
  detectionWindow: string,
  firstEventAt: Date | null,
  lastEventAt: Date | null,
  investigationAction: string
): GovernanceAnomaly {
  return {
    id: generateAnomalyId(type, actor?.id),
    type,
    title,
    description,
    severity,
    actor,
    eventCount,
    detectionWindow,
    firstEventAt,
    lastEventAt,
    firstEventAtISO: firstEventAt?.toISOString() ?? null,
    lastEventAtISO: lastEventAt?.toISOString() ?? null,
    investigationAction,
  };
}

export async function detectGovernanceAnomalies(): Promise<GovernanceAnomaly[]> {
  const anomalies: GovernanceAnomaly[] = [];
  const now = new Date();
  const ago1h = new Date(now.getTime() - 60 * 60 * 1000);
  const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ago7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // ── 1. Repeated CRITICAL events from same actor (>3 in 1 hour) ──────────────
  const criticalByActor = await prisma.auditLog.groupBy({
    by: ["actorId"],
    where: {
      createdAt: { gte: ago1h },
      severity: "CRITICAL",
      actorId: { not: null },
    },
    _count: { id: true },
    having: {
      id: { _count: { gt: 3 } },
    },
  });

  for (const group of criticalByActor) {
    if (!group.actorId) continue;

    const actorUser = await prisma.user.findUnique({
      where: { id: group.actorId },
      select: { id: true, name: true, email: true, role: true },
    });

    const actor: GovernanceActorIdentity | null = actorUser
      ? {
          id: actorUser.id,
          name: actorUser.name,
          email: actorUser.email,
          role: actorUser.role,
        }
      : null;

    // Get the time range
    const events = await prisma.auditLog.findMany({
      where: {
        createdAt: { gte: ago1h },
        severity: "CRITICAL",
        actorId: group.actorId,
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });

    anomalies.push(
      buildAnomaly(
        "REPEATED_CRITICAL_ACTOR",
        "Repeated CRITICAL Governance Events",
        `Actor generated ${group._count.id} CRITICAL-severity events within 1 hour. This volume of high-risk operations may indicate automated abuse or unauthorized escalation.`,
        "SEVERE",
        actor,
        group._count.id,
        "Last 1 hour",
        events[0]?.createdAt ?? null,
        events[events.length - 1]?.createdAt ?? null,
        "Open Security Forensics → Investigate actor activity chain"
      )
    );
  }

  // ── 2. Role escalation spike (>3 role changes in 24h) ──────────────────────
  const recentRoleChanges = await prisma.roleChangeAudit.count({
    where: { changedAt: { gte: ago24h } },
  });

  if (recentRoleChanges > 3) {
    const changes = await prisma.roleChangeAudit.findMany({
      where: { changedAt: { gte: ago24h } },
      orderBy: { changedAt: "asc" },
      select: { changedAt: true },
    });

    anomalies.push(
      buildAnomaly(
        "ROLE_ESCALATION_SPIKE",
        "Elevated Role Escalation Activity",
        `${recentRoleChanges} role changes detected in the last 24 hours. Sustained privilege escalation activity may indicate unauthorized governance operations.`,
        "CRITICAL",
        null,
        recentRoleChanges,
        "Last 24 hours",
        changes[0]?.changedAt ?? null,
        changes[changes.length - 1]?.changedAt ?? null,
        "Open RBAC Governance → Review role change audit trail"
      )
    );
  }

  // ── 3. Infrastructure override spike (>2 in 24h) ───────────────────────────
  const infraEvents = await prisma.auditLog.count({
    where: {
      createdAt: { gte: ago24h },
      action: { contains: "INFRASTRUCTURE", mode: "insensitive" },
      severity: { in: ["HIGH", "CRITICAL"] },
    },
  });

  if (infraEvents > 2) {
    const events = await prisma.auditLog.findMany({
      where: {
        createdAt: { gte: ago24h },
        action: { contains: "INFRASTRUCTURE", mode: "insensitive" },
        severity: { in: ["HIGH", "CRITICAL"] },
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });

    anomalies.push(
      buildAnomaly(
        "INFRASTRUCTURE_OVERRIDE_SPIKE",
        "Infrastructure Override Cluster Detected",
        `${infraEvents} infrastructure override events detected in 24 hours. Abnormal infrastructure modification activity may indicate unauthorized system changes.`,
        "CRITICAL",
        null,
        infraEvents,
        "Last 24 hours",
        events[0]?.createdAt ?? null,
        events[events.length - 1]?.createdAt ?? null,
        "Open Governance Timeline → Filter by INFRASTRUCTURE category"
      )
    );
  }

  // ── 4. Unusual governance volume (>50 events in 1h vs baseline) ───────────
  const eventsLastHour = await prisma.auditLog.count({
    where: { createdAt: { gte: ago1h } },
  });

  const eventsHourBefore = await prisma.auditLog.count({
    where: {
      createdAt: {
        gte: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        lt: ago1h,
      },
    },
  });

  // Spike: current hour > 3x previous hour AND > 20 absolute events
  if (eventsLastHour > 20 && eventsLastHour > eventsHourBefore * 3 && eventsHourBefore > 0) {
    anomalies.push(
      buildAnomaly(
        "UNUSUAL_GOVERNANCE_VOLUME",
        "Abnormal Governance Event Volume",
        `${eventsLastHour} governance events in the last hour vs ${eventsHourBefore} in the previous hour (${Math.round((eventsLastHour / Math.max(eventsHourBefore, 1)) * 100)}% increase). This spike may indicate automated operations or an ongoing governance incident.`,
        "HIGH",
        null,
        eventsLastHour,
        "Last 1 hour",
        ago1h,
        now,
        "Open Governance Timeline → Review recent event volume"
      )
    );
  }

  // ── 5. Rapid setting changes (>3 in 1h) ────────────────────────────────────
  const settingChanges = await prisma.settingAudit.count({
    where: { changedAt: { gte: ago1h } },
  });

  if (settingChanges > 3) {
    const changes = await prisma.settingAudit.findMany({
      where: { changedAt: { gte: ago1h } },
      orderBy: { changedAt: "asc" },
      select: { changedAt: true },
    });

    anomalies.push(
      buildAnomaly(
        "RAPID_SETTING_CHANGES",
        "Rapid Platform Setting Modifications",
        `${settingChanges} platform settings changed within 1 hour. Rapid configuration changes may indicate unauthorized platform override activity or a governance audit gap.`,
        "HIGH",
        null,
        settingChanges,
        "Last 1 hour",
        changes[0]?.changedAt ?? null,
        changes[changes.length - 1]?.changedAt ?? null,
        "Open Platform Controls → Review setting audit trail"
      )
    );
  }

  // ── 6. HIGH_RISK_BLOCKED events (attempted dangerous operations) ────────────
  const blockedHighRisk = await prisma.auditLog.count({
    where: {
      createdAt: { gte: ago7d },
      action: { contains: "HIGH_RISK_BLOCKED", mode: "insensitive" },
    },
  });

  if (blockedHighRisk > 0) {
    const events = await prisma.auditLog.findMany({
      where: {
        createdAt: { gte: ago7d },
        action: { contains: "HIGH_RISK_BLOCKED", mode: "insensitive" },
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });

    anomalies.push(
      buildAnomaly(
        "PERMISSION_FAILURE_CLUSTER",
        "Blocked High-Risk Operation Attempts",
        `${blockedHighRisk} high-risk operation attempts were blocked by the governance system in the last 7 days. This may indicate unauthorized access attempts or misconfigured automation.`,
        blockedHighRisk > 5 ? "SEVERE" : "CRITICAL",
        null,
        blockedHighRisk,
        "Last 7 days",
        events[0]?.createdAt ?? null,
        events[events.length - 1]?.createdAt ?? null,
        "Open Security Forensics → Review blocked operation events"
      )
    );
  }

  // Sort by severity weight then recency
  const severityWeight: Record<ComplianceSeverity, number> = {
    SEVERE: 5,
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  return anomalies.sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity]);
}
