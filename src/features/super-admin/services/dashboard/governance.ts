import { prisma } from "@/lib/prisma";
import type { GovernanceStatusData } from "@/types/super-admin-dashboard";

export async function getGovernanceStatus(): Promise<GovernanceStatusData> {
  const [activeAdmins, activeModerators, recentChanges, auditEvents] = await Promise.all([
    prisma.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
    prisma.user.count({ where: { role: "MODERATOR" } }),
    prisma.roleChangeAudit.count({
      where: { changedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
    prisma.auditLog.count({
      where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    }),
  ]);

  return {
    activeAdmins,
    activeModerators,
    recentRoleChanges: recentChanges,
    auditEvents24h: auditEvents,
    privilegedOperations: auditEvents, // Simplification for dashboard
    governanceRiskScore: "LOW",
  };
}
