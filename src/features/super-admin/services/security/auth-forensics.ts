/**
 * QuizArena — SOC Authentication Forensics
 *
 * Investigates authentication threats:
 * - Failed login patterns & brute-force detection
 * - OAuth failures
 * - Suspicious session activity
 * - Stale session anomalies
 * - Credential failures
 *
 * Server-side only. Future-ready for MFA, device trust, IP reputation.
 *
 * Phase 7.7: Security Operations Center
 */

import { prisma } from "@/lib/prisma";
import type {
  AuthForensicsData,
  AuthForensicEvent,
  BruteForceProfile,
  SecurityActorIdentity,
  AuthEventType,
  ThreatSeverity,
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

function classifyAuthEventType(action: string): AuthEventType {
  const upper = action.toUpperCase();
  if (upper.includes("SESSION_ESTABLISHED") || upper.includes("LOGIN_SUCCESS"))
    return "LOGIN_SUCCESS";
  if (upper.includes("LOGOUT") || upper.includes("SIGN_OUT")) return "LOGOUT";
  if (upper.includes("SESSION_INVALIDATED") || upper.includes("FORCE_LOGOUT"))
    return "SESSION_INVALIDATED";
  if (upper.includes("OAUTH_FAILURE") || upper.includes("OAUTH_ERROR")) return "OAUTH_FAILURE";
  if (upper.includes("CREDENTIAL_FAILURE") || upper.includes("WRONG_PASSWORD"))
    return "CREDENTIAL_FAILURE";
  if (upper.includes("STALE_SESSION") || upper.includes("SESSION_EXPIRED"))
    return "STALE_SESSION_DETECTED";
  if (upper.includes("EMAIL_MISMATCH")) return "EMAIL_MISMATCH";
  if (upper.includes("ROLE_REVOKED") || upper.includes("DB_ROLE_REVOKED")) return "ROLE_REVOKED";
  if (upper.includes("LOGIN_FAIL") || upper.includes("AUTH_FAIL") || upper.includes("FAILED"))
    return "LOGIN_FAILURE";
  return "LOGIN_FAILURE";
}

function deriveFailureReason(action: string, authType: AuthEventType): string | null {
  switch (authType) {
    case "LOGIN_FAILURE":
      return "Authentication credentials rejected";
    case "OAUTH_FAILURE":
      return "OAuth provider authentication failed";
    case "CREDENTIAL_FAILURE":
      return "Invalid credentials supplied";
    case "STALE_SESSION_DETECTED":
      return "Session role does not match database role";
    case "EMAIL_MISMATCH":
      return "Authenticated email does not match sovereign admin email";
    case "ROLE_REVOKED":
      return "Role privileges revoked — session invalidated";
    default:
      if (action.toUpperCase().includes("DENIED")) return "Access explicitly denied";
      return null;
  }
}

function mapAuthSeverity(action: string, authType: AuthEventType): ThreatSeverity {
  if (authType === "EMAIL_MISMATCH" || authType === "ROLE_REVOKED") return "CRITICAL";
  if (authType === "STALE_SESSION_DETECTED") return "HIGH";
  if (authType === "OAUTH_FAILURE") return "MEDIUM";
  if (authType === "LOGIN_FAILURE" || authType === "CREDENTIAL_FAILURE") return "MEDIUM";
  if (authType === "SESSION_INVALIDATED") return "MEDIUM";
  return "LOW";
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

export async function investigateAuthFailures(): Promise<AuthForensicsData> {
  const now = new Date();
  const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ago7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const ago1h = new Date(now.getTime() - 60 * 60 * 1000);

  const actorSelect = { select: { id: true, name: true, email: true, role: true } } as const;

  const [
    recentAuthEventsRaw,
    authFailures24h,
    authFailures7d,
    oauthFailures24h,
    suspiciousSessions,
  ] = await Promise.all([
    // Recent auth events (last 7d)
    prisma.auditLog.findMany({
      where: {
        createdAt: { gte: ago7d },
        entityType: { in: ["AUTH", "SECURITY"] },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { actor: actorSelect },
    }),

    // Auth failures 24h (medium+ severity)
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago24h },
        entityType: { in: ["AUTH", "SECURITY"] },
        severity: { in: ["MEDIUM", "HIGH", "CRITICAL"] },
      },
    }),

    // Auth failures 7d
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago7d },
        entityType: { in: ["AUTH", "SECURITY"] },
        severity: { in: ["MEDIUM", "HIGH", "CRITICAL"] },
      },
    }),

    // OAuth failures 24h
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago24h },
        action: { contains: "OAUTH", mode: "insensitive" },
      },
    }),

    // Suspicious session events 24h
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago24h },
        entityType: { in: ["AUTH", "SECURITY"] },
        severity: "CRITICAL",
      },
    }),
  ]);

  // Map auth events
  const recentAuthEvents: AuthForensicEvent[] = recentAuthEventsRaw.map((entry) => {
    const meta = parseMetadata(entry.metadata);
    const authEventType = classifyAuthEventType(entry.action);
    const severity = mapAuthSeverity(entry.action, authEventType);
    const isOAuthFailure = authEventType === "OAUTH_FAILURE";
    const isLoginFailure =
      authEventType === "LOGIN_FAILURE" || authEventType === "CREDENTIAL_FAILURE";

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
      authEventType,
      actor,
      severity,
      timestampISO: entry.createdAt.toISOString(),
      timeAgo: computeTimeAgo(entry.createdAt),
      ipAddress: entry.ipAddress,
      metadata: meta,
      isBruteForce: false, // Set in brute-force detection pass below
      isOAuthFailure,
      failureReason: isLoginFailure ? deriveFailureReason(entry.action, authEventType) : null,
    };
  });

  // ── Brute-Force Detection ─────────────────────────────────────────────────
  // Group auth failures by actor in last 1h
  const recentFailures = await prisma.auditLog.findMany({
    where: {
      createdAt: { gte: ago1h },
      entityType: { in: ["AUTH", "SECURITY"] },
      severity: { in: ["MEDIUM", "HIGH", "CRITICAL"] },
      actorId: { not: null },
    },
    orderBy: { createdAt: "asc" },
    select: { actorId: true, ipAddress: true, createdAt: true },
  });

  // Group by actorId
  const actorFailureMap = new Map<
    string,
    { count: number; ips: Set<string>; first: Date; last: Date }
  >();

  for (const f of recentFailures) {
    if (!f.actorId) continue;
    const existing = actorFailureMap.get(f.actorId);
    if (existing) {
      existing.count++;
      if (f.ipAddress) existing.ips.add(f.ipAddress);
      if (f.createdAt < existing.first) existing.first = f.createdAt;
      if (f.createdAt > existing.last) existing.last = f.createdAt;
    } else {
      actorFailureMap.set(f.actorId, {
        count: 1,
        ips: new Set(f.ipAddress ? [f.ipAddress] : []),
        first: f.createdAt,
        last: f.createdAt,
      });
    }
  }

  const bruteForceProfiles: BruteForceProfile[] = [];
  for (const [actorId, data] of actorFailureMap.entries()) {
    if (data.count >= 3) {
      // ≥3 failures in 1h = brute force
      bruteForceProfiles.push({
        actorId,
        ipAddress: data.ips.size > 0 ? Array.from(data.ips)[0] : null,
        failureCount: data.count,
        windowHours: 1,
        firstAttemptISO: data.first.toISOString(),
        lastAttemptISO: data.last.toISOString(),
      });

      // Mark corresponding auth events as brute force
      for (const event of recentAuthEvents) {
        if (event.actor?.id === actorId) {
          event.isBruteForce = true;
        }
      }
    }
  }

  // Determine auth threat level
  let authThreatLevel: AuthForensicsData["authThreatLevel"] = "NORMAL";
  if (bruteForceProfiles.length > 0 || suspiciousSessions > 5 || authFailures24h > 20) {
    authThreatLevel = "THREAT";
  } else if (authFailures24h > 5 || suspiciousSessions > 0) {
    authThreatLevel = "ELEVATED";
  }

  return {
    recentAuthEvents,
    bruteForceProfiles,
    totalAuthFailures24h: authFailures24h,
    totalAuthFailures7d: authFailures7d,
    oauthFailures24h,
    suspiciousSessionEvents24h: suspiciousSessions,
    authThreatLevel,
  };
}
