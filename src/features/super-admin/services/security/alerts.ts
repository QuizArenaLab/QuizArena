/**
 * QuizArena — SOC Security Alert Center
 *
 * Derives actionable security alerts from aggregated threat data:
 * - Brute-force behavior alerts
 * - Suspicious role access alerts
 * - Abnormal SUPER_ADMIN activity alerts
 * - Governance abuse attempt alerts
 * - Operational anomaly alerts
 *
 * Server-side only. Alerts are severity-classified and operationally meaningful.
 *
 * Phase 7.7: Security Operations Center
 */

import { prisma } from "@/lib/prisma";
import type { SecurityAlert, AlertType, ThreatSeverity } from "@/types/super-admin-security";

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

function buildAlert(
  alertType: AlertType,
  title: string,
  description: string,
  severity: ThreatSeverity,
  eventCount: number,
  timestampISO: string,
  timeAgo: string,
  investigationWorkflow: string,
  requiresImmediateAction: boolean
): SecurityAlert {
  return {
    id: `alert-${alertType}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    alertType,
    title,
    description,
    severity,
    timestampISO,
    timeAgo,
    eventCount,
    isActive: true,
    investigationWorkflow,
    requiresImmediateAction,
  };
}

export async function getSecurityAlerts(): Promise<SecurityAlert[]> {
  const alerts: SecurityAlert[] = [];
  const now = new Date();
  const ago1h = new Date(now.getTime() - 60 * 60 * 1000);
  const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ago7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // ── 1. Brute-Force Detection (≥5 auth failures in 1h per actor) ───────────
  const bruteForceGroups = await prisma.auditLog.groupBy({
    by: ["actorId"],
    where: {
      createdAt: { gte: ago1h },
      entityType: { in: ["AUTH", "SECURITY"] },
      severity: { in: ["MEDIUM", "HIGH", "CRITICAL"] },
      actorId: { not: null },
    },
    _count: { id: true },
    having: { id: { _count: { gte: 5 } } },
  });

  if (bruteForceGroups.length > 0) {
    const totalAttempts = bruteForceGroups.reduce((sum, g) => sum + g._count.id, 0);
    alerts.push(
      buildAlert(
        "BRUTE_FORCE_DETECTED",
        "Brute-Force Behavior Detected",
        `${bruteForceGroups.length} actor(s) with ≥5 authentication failures in the last hour (${totalAttempts} total attempts). Potential credential-stuffing or brute-force attack in progress.`,
        "SEVERE",
        totalAttempts,
        now.toISOString(),
        "just now",
        "Open Authentication Forensics → Review brute-force actor profiles",
        true
      )
    );
  }

  // ── 2. Privilege Escalation Attempts (any ADMIN/SUPER_ADMIN promotion in 24h) ──
  const escalationsToPrivileged = await prisma.roleChangeAudit.count({
    where: {
      changedAt: { gte: ago24h },
      newRole: { in: ["ADMIN", "SUPER_ADMIN"] },
    },
  });

  if (escalationsToPrivileged > 0) {
    const latestEscalation = await prisma.roleChangeAudit.findFirst({
      where: {
        changedAt: { gte: ago24h },
        newRole: { in: ["ADMIN", "SUPER_ADMIN"] },
      },
      orderBy: { changedAt: "desc" },
      select: { changedAt: true },
    });

    alerts.push(
      buildAlert(
        "PRIVILEGE_ESCALATION_ATTEMPT",
        "Privileged Role Escalation Detected",
        `${escalationsToPrivileged} role promotion(s) to ADMIN or SUPER_ADMIN in the last 24 hours. All privilege escalations to sovereign roles require immediate verification.`,
        escalationsToPrivileged > 2 ? "CRITICAL" : "HIGH",
        escalationsToPrivileged,
        latestEscalation?.changedAt?.toISOString() ?? now.toISOString(),
        computeTimeAgo(latestEscalation?.changedAt ?? now),
        "Open Privilege Escalation Panel → Verify role change authorization",
        escalationsToPrivileged > 2
      )
    );
  }

  // ── 3. Governance Abuse (blocked high-risk operations in 7d) ─────────────
  const blockedOps = await prisma.auditLog.count({
    where: {
      createdAt: { gte: ago7d },
      action: { contains: "HIGH_RISK_BLOCKED", mode: "insensitive" },
    },
  });

  if (blockedOps > 0) {
    const latestBlocked = await prisma.auditLog.findFirst({
      where: {
        createdAt: { gte: ago7d },
        action: { contains: "HIGH_RISK_BLOCKED", mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    alerts.push(
      buildAlert(
        "GOVERNANCE_ABUSE_DETECTED",
        "Governance Abuse Attempts Blocked",
        `${blockedOps} high-risk operation attempt(s) blocked by the governance system in the last 7 days. These represent potential platform override or unauthorized infrastructure control attempts.`,
        blockedOps > 5 ? "SEVERE" : "CRITICAL",
        blockedOps,
        latestBlocked?.createdAt?.toISOString() ?? now.toISOString(),
        computeTimeAgo(latestBlocked?.createdAt ?? now),
        "Open Threat Timeline → Filter HIGH_RISK_BLOCKED events",
        blockedOps > 5
      )
    );
  }

  // ── 4. RBAC Violation Cluster (≥3 RBAC violations in 24h) ────────────────
  const rbacViolations24h = await prisma.auditLog.count({
    where: {
      createdAt: { gte: ago24h },
      entityType: "ROLE",
      severity: { in: ["HIGH", "CRITICAL"] },
    },
  });

  if (rbacViolations24h >= 3) {
    const latestViolation = await prisma.auditLog.findFirst({
      where: {
        createdAt: { gte: ago24h },
        entityType: "ROLE",
        severity: { in: ["HIGH", "CRITICAL"] },
      },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    alerts.push(
      buildAlert(
        "RBAC_VIOLATION_CLUSTER",
        "RBAC Violation Cluster Detected",
        `${rbacViolations24h} role-based access control violations in the last 24 hours. Sustained RBAC violations may indicate systematic authorization bypass attempts.`,
        "CRITICAL",
        rbacViolations24h,
        latestViolation?.createdAt?.toISOString() ?? now.toISOString(),
        computeTimeAgo(latestViolation?.createdAt ?? now),
        "Open Privilege Escalation Panel → Review RBAC violations",
        rbacViolations24h > 5
      )
    );
  }

  // ── 5. Session Anomalies (CRITICAL session events in 24h) ────────────────
  const sessionAnomalies = await prisma.auditLog.count({
    where: {
      createdAt: { gte: ago24h },
      entityType: { in: ["AUTH", "SECURITY"] },
      severity: "CRITICAL",
    },
  });

  if (sessionAnomalies > 0) {
    const latestAnomaly = await prisma.auditLog.findFirst({
      where: {
        createdAt: { gte: ago24h },
        entityType: { in: ["AUTH", "SECURITY"] },
        severity: "CRITICAL",
      },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    alerts.push(
      buildAlert(
        "SESSION_ANOMALY_DETECTED",
        "Critical Session Anomalies Detected",
        `${sessionAnomalies} critical-severity session or authentication event(s) in the last 24 hours. Session integrity may be compromised.`,
        "CRITICAL",
        sessionAnomalies,
        latestAnomaly?.createdAt?.toISOString() ?? now.toISOString(),
        computeTimeAgo(latestAnomaly?.createdAt ?? now),
        "Open Session Governance → Review active privileged sessions",
        sessionAnomalies > 3
      )
    );
  }

  // ── 6. Operational Spike Alert ────────────────────────────────────────────
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

  if (eventsLastHour > 30 && eventsLastHour > eventsHourBefore * 3 && eventsHourBefore > 0) {
    alerts.push(
      buildAlert(
        "OPERATIONAL_SPIKE",
        "Abnormal Operational Volume Spike",
        `${eventsLastHour} governance events in the last hour vs ${eventsHourBefore} in the previous hour. This ${Math.round((eventsLastHour / Math.max(eventsHourBefore, 1)) * 100)}% spike may indicate automated operations or an ongoing governance incident.`,
        "HIGH",
        eventsLastHour,
        now.toISOString(),
        "just now",
        "Open Threat Timeline → Review recent high-volume events",
        false
      )
    );
  }

  // Sort: requiresImmediateAction first, then by severity weight
  const severityWeight: Record<ThreatSeverity, number> = {
    SEVERE: 5,
    CRITICAL: 4,
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  return alerts.sort((a, b) => {
    if (a.requiresImmediateAction !== b.requiresImmediateAction) {
      return a.requiresImmediateAction ? -1 : 1;
    }
    return severityWeight[b.severity] - severityWeight[a.severity];
  });
}
