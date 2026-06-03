import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getPlatformOverview = unstable_cache(
  async () => {
    const [totalUsers, activeCompetitions, pendingReports, criticalAlerts] = await Promise.all([
      prisma.user.count(),
      prisma.challenge.count({ where: { status: "LIVE" } }),
      prisma.report.count({ where: { status: "OPEN" } }),
      prisma.auditLog.count({ where: { severity: "CRITICAL" } }),
    ]);

    return {
      totalUsers,
      activeCompetitions,
      pendingReports,
      criticalAlerts,
    };
  },
  ["admin-platform-overview"],
  { revalidate: 60, tags: ["admin", "overview"] }
);
