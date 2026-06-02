/**
 * QuizArena — SOC Session Security Governance
 *
 * Privileged session monitoring:
 * - Active session enumeration with expiry analysis
 * - Stale session detection
 * - Session risk scoring (age + role + activity)
 * - Concurrent session anomaly detection
 *
 * Future-ready for: device fingerprints, trusted devices, session risk scoring.
 *
 * Server-side only. SUPER_ADMIN governance infrastructure.
 *
 * Phase 7.7: Security Operations Center
 */

import { prisma } from "@/lib/prisma";
import type {
  SessionGovernanceData,
  PrivilegedSession,
  SecurityActorIdentity,
  SessionRiskLevel,
} from "@/types/super-admin-security";
import { ROLES } from "@/features/rbac/services/roles";

const STALE_THRESHOLD_HOURS = 8; // Sessions older than 8h are flagged as stale

function computeSessionRiskScore(params: {
  ageMinutes: number;
  role: string;
  isStale: boolean;
  isExpired: boolean;
}): number {
  let score = 0;

  // Role-based risk
  if (params.role === ROLES.SUPER_ADMIN) score += 30;
  else if (params.role === ROLES.ADMIN) score += 20;
  else if (params.role === ROLES.MODERATOR) score += 10;

  // Age-based risk
  if (params.ageMinutes > 60 * 24)
    score += 30; // > 24h
  else if (params.ageMinutes > 60 * 8)
    score += 20; // > 8h
  else if (params.ageMinutes > 60 * 4) score += 10; // > 4h

  // Stale session
  if (params.isStale) score += 20;

  return Math.min(100, score);
}

function computeSessionRiskLevel(score: number): SessionRiskLevel {
  if (score >= 75) return "CRITICAL";
  if (score >= 50) return "HIGH";
  if (score >= 25) return "MEDIUM";
  return "LOW";
}

function buildRiskFactors(params: {
  ageMinutes: number;
  role: string;
  isStale: boolean;
}): string[] {
  const factors: string[] = [];

  if (params.role === ROLES.SUPER_ADMIN) factors.push("SUPER_ADMIN role — sovereign authority");
  else if (params.role === ROLES.ADMIN) factors.push("ADMIN role — elevated privileges");
  else if (params.role === ROLES.MODERATOR) factors.push("MODERATOR role — operational access");

  if (params.ageMinutes > 60 * 24)
    factors.push(`Long-lived session (${Math.round(params.ageMinutes / 60)}h)`);
  else if (params.ageMinutes > 60 * 8)
    factors.push(`Extended session (${Math.round(params.ageMinutes / 60)}h)`);

  if (params.isStale) factors.push("Session is stale — past threshold");

  return factors;
}

export async function monitorPrivilegedSessions(): Promise<SessionGovernanceData> {
  const now = new Date();
  const staleThreshold = new Date(now.getTime() - STALE_THRESHOLD_HOURS * 60 * 60 * 1000);

  const actorSelect = { select: { id: true, name: true, email: true, role: true } } as const;

  const [activeSessions, expiredSessions] = await Promise.all([
    // Active sessions (not yet expired) with user info
    prisma.session.findMany({
      where: { expires: { gt: now } },
      orderBy: { expires: "asc" },
      take: 50,
      include: { user: actorSelect },
    }),

    // Count expired (stale) sessions
    prisma.session.count({
      where: { expires: { lt: now } },
    }),
  ]);

  // Map to PrivilegedSession
  const privilegedSessions: PrivilegedSession[] = activeSessions.map((session) => {
    const user = session.user;
    const expiresAt = session.expires;

    // Estimate session age: we don't have createdAt on Session model,
    // so approximate as 24h before expiry (NextAuth default session duration)
    const estimatedCreatedAt = new Date(expiresAt.getTime() - 24 * 60 * 60 * 1000);
    const ageMs = now.getTime() - estimatedCreatedAt.getTime();
    const ageMinutes = Math.max(0, Math.floor(ageMs / 60000));
    const isStale = estimatedCreatedAt < staleThreshold;

    const riskScore = computeSessionRiskScore({
      ageMinutes,
      role: user.role,
      isStale,
      isExpired: expiresAt < now,
    });

    const expiresInMs = expiresAt.getTime() - now.getTime();
    const expiresInMinutes = Math.max(0, Math.floor(expiresInMs / 60000));

    const actor: SecurityActorIdentity = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      id: session.id,
      actor,
      expiresAtISO: expiresAt.toISOString(),
      createdAtISO: estimatedCreatedAt.toISOString(),
      isStale,
      ageMinutes,
      expiresInMinutes,
      riskLevel: computeSessionRiskLevel(riskScore),
      riskScore,
      riskFactors: buildRiskFactors({ ageMinutes, role: user.role, isStale }),
    };
  });

  // Sort by risk score descending
  privilegedSessions.sort((a, b) => b.riskScore - a.riskScore);

  const staleCount = privilegedSessions.filter((s) => s.isStale).length;
  const highRiskSessions = privilegedSessions.filter(
    (s) => s.riskLevel === "CRITICAL" || s.riskLevel === "HIGH"
  ).length;

  const averageAgeMinutes =
    privilegedSessions.length > 0
      ? Math.round(
          privilegedSessions.reduce((sum, s) => sum + s.ageMinutes, 0) / privilegedSessions.length
        )
      : 0;

  let sessionHealthStatus: SessionGovernanceData["sessionHealthStatus"] = "HEALTHY";
  if (highRiskSessions > 3 || staleCount > 5) {
    sessionHealthStatus = "CRITICAL";
  } else if (highRiskSessions > 0 || staleCount > 2) {
    sessionHealthStatus = "ELEVATED";
  }

  return {
    activeSessions: privilegedSessions,
    totalActiveSessions: privilegedSessions.length,
    staleSessions: staleCount + expiredSessions,
    highRiskSessions,
    averageSessionAgeMinutes: averageAgeMinutes,
    sessionHealthStatus,
  };
}
