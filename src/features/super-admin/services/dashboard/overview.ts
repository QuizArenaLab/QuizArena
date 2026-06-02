import { prisma } from "@/lib/prisma";
import type { PlatformOverviewData } from "@/types/super-admin-dashboard";

export async function getPlatformOverview(): Promise<PlatformOverviewData> {
  const [totalUsers, totalModerators, totalAdmins, activeChallenges, reviewChallenges] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "MODERATOR" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.challenge.count({ where: { status: "LIVE" } }),
      prisma.challenge.count({ where: { status: "DRAFT" } }),
    ]);

  // Derive some synthetic values for the Phase 7.2 strategic view
  // In a real system, these would come from deeper analytics pipelines.

  const operationalHealthScore = 98; // Synthetic baseline
  const engagementTrend = "UP"; // Assuming upward trend

  const totalFails = await prisma.user.count({ where: { accountState: "SUSPENDED" } });
  let infrastructureState: "HEALTHY" | "WARNING" | "CRITICAL" = "HEALTHY";
  if (totalFails > 10) infrastructureState = "CRITICAL";
  else if (totalFails > 0) infrastructureState = "WARNING";

  return {
    totalUsers,
    totalModerators,
    totalAdmins,
    activeChallenges,
    moderationThroughput: reviewChallenges,
    operationalHealthScore,
    engagementTrend,
    infrastructureState,
    securityAlertCount: totalFails, // tying suspended accounts to security alerts for demo
  };
}
