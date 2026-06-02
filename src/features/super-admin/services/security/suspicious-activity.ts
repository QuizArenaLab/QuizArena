/**
 * QuizArena — SOC Suspicious Activity Intelligence
 *
 * Anomaly-detection foundation:
 * - Repeated login failures per actor
 * - Abnormal moderation activity spikes
 * - Repeated permission-denied actions
 * - Sudden operational volume spikes
 * - Governance frequency anomalies
 *
 * Server-side only. Future-ready for ML anomaly scoring.
 *
 * Phase 7.7: Security Operations Center
 */

import { prisma } from "@/lib/prisma";
import type {
  SuspiciousActivityData,
  SuspiciousActorProfile,
  SuspiciousPattern,
  SecurityActorIdentity,
} from "@/types/super-admin-security";

function computeRiskScore(patterns: SuspiciousPattern[], anomalyCount: number): number {
  let score = 0;

  // Pattern-based scoring
  for (const pattern of patterns) {
    switch (pattern) {
      case "REPEATED_AUTH_FAILURE":
        score += 25;
        break;
      case "REPEATED_PERMISSION_DENIED":
        score += 20;
        break;
      case "HIGH_RISK_SEQUENCE":
        score += 30;
        break;
      case "OPERATIONAL_SPIKE":
        score += 15;
        break;
      case "ABNORMAL_MODERATION_VOLUME":
        score += 15;
        break;
      case "GOVERNANCE_FREQUENCY_ANOMALY":
        score += 10;
        break;
      case "ABNORMAL_ADMIN_HOURS":
        score += 10;
        break;
    }
  }

  // Volume bonus (up to +20)
  score += Math.min(anomalyCount * 2, 20);

  return Math.min(100, score);
}

function computeRiskLevel(score: number): SuspiciousActorProfile["riskLevel"] {
  if (score >= 75) return "CRITICAL";
  if (score >= 50) return "HIGH";
  if (score >= 25) return "MEDIUM";
  return "LOW";
}

function buildPatternDescription(
  patterns: SuspiciousPattern[],
  anomalyCount: number,
  actorName: string | null
): string {
  const name = actorName ?? "Unknown actor";
  const patternLabels: Record<SuspiciousPattern, string> = {
    REPEATED_AUTH_FAILURE: "repeated authentication failures",
    REPEATED_PERMISSION_DENIED: "repeated permission denials",
    HIGH_RISK_SEQUENCE: "high-risk operation sequences",
    OPERATIONAL_SPIKE: "abnormal operational volume spike",
    ABNORMAL_MODERATION_VOLUME: "abnormal moderation activity",
    GOVERNANCE_FREQUENCY_ANOMALY: "governance frequency anomaly",
    ABNORMAL_ADMIN_HOURS: "off-hours admin activity",
  };
  const labels = patterns.map((p) => patternLabels[p]);
  return `${name} shows ${labels.join(", ")} (${anomalyCount} anomalous events detected).`;
}

function buildInvestigationWorkflow(patterns: SuspiciousPattern[]): string {
  if (patterns.includes("REPEATED_AUTH_FAILURE")) {
    return "Open Authentication Forensics → Investigate login failure pattern";
  }
  if (patterns.includes("HIGH_RISK_SEQUENCE")) {
    return "Open Privilege Escalation Panel → Review high-risk operation chain";
  }
  if (patterns.includes("REPEATED_PERMISSION_DENIED")) {
    return "Open Privilege Escalation → Review RBAC violation events";
  }
  if (patterns.includes("ABNORMAL_MODERATION_VOLUME")) {
    return "Open Compliance Timeline → Filter by actor and MODERATION category";
  }
  return "Open Threat Timeline → Filter by actor to reconstruct event chain";
}

export async function detectSuspiciousActivity(): Promise<SuspiciousActivityData> {
  const now = new Date();
  const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ago1h = new Date(now.getTime() - 60 * 60 * 1000);

  // ── 1. Actors with repeated auth failures (≥3 in 24h) ───────────────────
  const authFailureActors = await prisma.auditLog.groupBy({
    by: ["actorId"],
    where: {
      createdAt: { gte: ago24h },
      entityType: { in: ["AUTH", "SECURITY"] },
      severity: { in: ["MEDIUM", "HIGH", "CRITICAL"] },
      actorId: { not: null },
    },
    _count: { id: true },
    having: { id: { _count: { gte: 3 } } },
  });

  // ── 2. Actors with repeated permission denials (≥3 in 24h) ────────────
  const permDeniedActors = await prisma.auditLog.groupBy({
    by: ["actorId"],
    where: {
      createdAt: { gte: ago24h },
      OR: [
        { action: { contains: "DENIED", mode: "insensitive" } },
        { action: { contains: "UNAUTHORIZED", mode: "insensitive" } },
        { action: { contains: "HIGH_RISK_BLOCKED", mode: "insensitive" } },
      ],
      actorId: { not: null },
    },
    _count: { id: true },
    having: { id: { _count: { gte: 3 } } },
  });

  // ── 3. Operational spike detection ───────────────────────────────────────
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

  const operationalSpikeDetected =
    eventsLastHour > 20 && eventsLastHour > eventsHourBefore * 3 && eventsHourBefore > 0;

  // ── Combine into actor profiles ───────────────────────────────────────────
  // Merge actor IDs from all detection passes
  const actorPatternMap = new Map<string, { patterns: Set<SuspiciousPattern>; counts: number[] }>();

  for (const group of authFailureActors) {
    if (!group.actorId) continue;
    const existing = actorPatternMap.get(group.actorId) ?? {
      patterns: new Set<SuspiciousPattern>(),
      counts: [],
    };
    existing.patterns.add("REPEATED_AUTH_FAILURE");
    existing.counts.push(group._count.id);
    actorPatternMap.set(group.actorId, existing);
  }

  for (const group of permDeniedActors) {
    if (!group.actorId) continue;
    const existing = actorPatternMap.get(group.actorId) ?? {
      patterns: new Set<SuspiciousPattern>(),
      counts: [],
    };
    existing.patterns.add("REPEATED_PERMISSION_DENIED");
    existing.counts.push(group._count.id);
    actorPatternMap.set(group.actorId, existing);
  }

  // ── Resolve actor identities ──────────────────────────────────────────────
  const actorIds = Array.from(actorPatternMap.keys());
  const actorUsers =
    actorIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: actorIds } },
          select: { id: true, name: true, email: true, role: true },
        })
      : [];

  const actorMap = new Map(actorUsers.map((u) => [u.id, u]));

  // ── Build profiles ────────────────────────────────────────────────────────
  const suspiciousActors: SuspiciousActorProfile[] = [];

  for (const [actorId, data] of actorPatternMap.entries()) {
    const user = actorMap.get(actorId);
    if (!user) continue;

    const actor: SecurityActorIdentity = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const patterns = Array.from(data.patterns);
    const anomalyCount = data.counts.reduce((sum, c) => sum + c, 0);
    const riskScore = computeRiskScore(patterns, anomalyCount);
    const riskLevel = computeRiskLevel(riskScore);

    // Fetch time range for this actor's anomalous events
    const actorEvents = await prisma.auditLog.findMany({
      where: {
        actorId,
        createdAt: { gte: ago24h },
        severity: { in: ["MEDIUM", "HIGH", "CRITICAL"] },
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
      take: 50,
    });

    const firstEvent = actorEvents[0]?.createdAt ?? now;
    const lastEvent = actorEvents[actorEvents.length - 1]?.createdAt ?? now;

    suspiciousActors.push({
      id: `suspicious-${actorId}`,
      actor,
      patterns,
      anomalyCount,
      riskScore,
      riskLevel,
      firstAnomalyISO: firstEvent.toISOString(),
      lastAnomalyISO: lastEvent.toISOString(),
      description: buildPatternDescription(patterns, anomalyCount, actor.name),
      investigationWorkflow: buildInvestigationWorkflow(patterns),
    });
  }

  // Sort by risk score descending
  suspiciousActors.sort((a, b) => b.riskScore - a.riskScore);

  const highRiskActorCount = suspiciousActors.filter(
    (a) => a.riskLevel === "CRITICAL" || a.riskLevel === "HIGH"
  ).length;

  return {
    suspiciousActors,
    totalAnomaliesDetected: suspiciousActors.reduce((sum, a) => sum + a.anomalyCount, 0),
    highRiskActorCount,
    operationalSpikesDetected: operationalSpikeDetected ? 1 : 0,
    lastAnalysisISO: now.toISOString(),
  };
}
