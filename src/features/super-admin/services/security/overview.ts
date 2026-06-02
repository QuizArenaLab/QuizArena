/**
 * QuizArena — SOC Security Overview Aggregator
 *
 * Computes platform-wide security KPIs and posture score.
 * Server-side only. SUPER_ADMIN forensic infrastructure.
 *
 * Phase 7.7: Security Operations Center
 */

import { prisma } from "@/lib/prisma";
import type { SecurityOverview } from "@/types/super-admin-security";

/**
 * Compute platform security posture score (0–100).
 * Higher score = safer posture.
 */
function computePostureScore(params: {
  criticalEvents24h: number;
  authFailures24h: number;
  rbacViolations24h: number;
  blockedHighRisk7d: number;
  staleSessions: number;
}): number {
  let score = 100;

  // Deduct for critical events (up to -30)
  score -= Math.min(params.criticalEvents24h * 5, 30);

  // Deduct for auth failures (up to -25)
  score -= Math.min(params.authFailures24h * 2, 25);

  // Deduct for RBAC violations (up to -20)
  score -= Math.min(params.rbacViolations24h * 5, 20);

  // Deduct for blocked high-risk ops (up to -15)
  score -= Math.min(params.blockedHighRisk7d * 3, 15);

  // Deduct for stale privileged sessions (up to -10)
  score -= Math.min(params.staleSessions * 5, 10);

  return Math.max(0, Math.round(score));
}

function deriveThreatStatus(
  score: number,
  criticalEvents: number
): SecurityOverview["platformThreatStatus"] {
  if (criticalEvents > 10 || score < 30) return "CRITICAL";
  if (criticalEvents > 3 || score < 60) return "THREATENED";
  if (criticalEvents > 0 || score < 80) return "ELEVATED";
  return "SECURE";
}

export async function getSecurityOverview(): Promise<SecurityOverview> {
  const now = new Date();
  const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ago7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const ago30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalEvents24h,
    totalEvents7d,
    totalEvents30d,
    severityGroups,
    criticalEvents24h,
    authFailures24h,
    rbacViolations24h,
    privilegeEscalations24h,
    blockedHighRisk7d,
    latestEvent,
    activeSessionCount,
    staleSessionCount,
  ] = await Promise.all([
    // Volume counts
    prisma.auditLog.count({ where: { createdAt: { gte: ago24h } } }),
    prisma.auditLog.count({ where: { createdAt: { gte: ago7d } } }),
    prisma.auditLog.count({ where: { createdAt: { gte: ago30d } } }),

    // Severity distribution (all-time for posture)
    prisma.auditLog.groupBy({
      by: ["severity"],
      _count: { severity: true },
    }),

    // Critical threats 24h
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago24h },
        severity: { in: ["CRITICAL", "HIGH"] },
      },
    }),

    // Auth failures 24h
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago24h },
        entityType: { in: ["AUTH", "SECURITY"] },
        severity: { in: ["MEDIUM", "HIGH", "CRITICAL"] },
      },
    }),

    // RBAC violations 24h
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago24h },
        entityType: "ROLE",
        severity: { in: ["HIGH", "CRITICAL"] },
      },
    }),

    // Privilege escalations 24h (role changes)
    prisma.roleChangeAudit.count({
      where: { changedAt: { gte: ago24h } },
    }),

    // Blocked high-risk operations 7d
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago7d },
        action: { contains: "HIGH_RISK_BLOCKED", mode: "insensitive" },
      },
    }),

    // Latest security event
    prisma.auditLog.findFirst({
      where: { severity: { in: ["HIGH", "CRITICAL"] } },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),

    // Active privileged sessions (non-expired)
    prisma.session.count({
      where: { expires: { gt: now } },
    }),

    // Stale sessions (expired but not yet purged)
    prisma.session.count({
      where: { expires: { lt: now } },
    }),
  ]);

  // Build severity breakdown
  const bySeverity = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0, SEVERE: 0 };
  for (const group of severityGroups) {
    const key = group.severity as keyof typeof bySeverity;
    if (key in bySeverity) {
      bySeverity[key] = group._count.severity;
    }
  }

  // SEVERE approximation — CRITICAL events from SUPER_ADMIN actors
  const severeCount = await prisma.auditLog.count({
    where: { severity: "CRITICAL", action: { contains: "SUPER_ADMIN", mode: "insensitive" } },
  });
  bySeverity.SEVERE = severeCount;

  // Active alerts = critical + high events in last 24h
  const activeAlerts = criticalEvents24h;

  const postureScore = computePostureScore({
    criticalEvents24h,
    authFailures24h,
    rbacViolations24h,
    blockedHighRisk7d,
    staleSessions: staleSessionCount,
  });

  const platformThreatStatus = deriveThreatStatus(postureScore, criticalEvents24h);

  return {
    totalEvents24h,
    totalEvents7d,
    totalEvents30d,
    bySeverity,
    activeAlerts,
    criticalThreats: criticalEvents24h,
    authFailures24h,
    privilegeEscalations24h,
    rbacViolations24h,
    activePrivilegedSessions: activeSessionCount,
    securityPostureScore: postureScore,
    platformThreatStatus,
    lastEventAtISO: latestEvent?.createdAt?.toISOString() ?? null,
    lastAggregatedISO: now.toISOString(),
  };
}
