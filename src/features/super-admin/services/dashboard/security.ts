import { prisma } from "@/lib/prisma";
import type { SecuritySnapshotData } from "@/types/super-admin-dashboard";

export async function getSecurityOverview(): Promise<SecuritySnapshotData> {
  const [suspendedUsers, auditEvents] = await Promise.all([
    prisma.user.count({ where: { accountState: "SUSPENDED" } }),
    prisma.auditLog.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        severity: { in: ["HIGH", "CRITICAL"] },
      },
    }),
  ]);

  let threatLevel: "LOW" | "ELEVATED" | "HIGH" | "CRITICAL" = "LOW";
  if (auditEvents > 20) threatLevel = "CRITICAL";
  else if (auditEvents > 10) threatLevel = "HIGH";
  else if (auditEvents > 0 || suspendedUsers > 5) threatLevel = "ELEVATED";

  return {
    failedLogins24h: 0, // Would come from auth rate limiter in real app
    suspiciousActivityCount: suspendedUsers,
    roleEscalationAttempts: auditEvents,
    abnormalModerationEvents: 0,
    unresolvedAbuseReports: 0, // Assuming abuse reports are cleared
    threatLevel,
  };
}
