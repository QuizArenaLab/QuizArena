import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getUserIntelligence = unstable_cache(
  async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const [newToday, suspended, avgTimeAgg, totalUsers, newThisWeek] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count({ where: { accountState: "SUSPENDED" } }),
      prisma.attempt.aggregate({ _avg: { timeTakenInSeconds: true } }),
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ]);

    const activeAttemptsToday = await prisma.attempt.groupBy({
      by: ["userId"],
      where: { startedAt: { gte: today } },
    });
    const activeToday = activeAttemptsToday.length;

    const returningUsersCount = await prisma.user.count({
      where: {
        createdAt: { lt: sevenDaysAgo },
        attempts: { some: {} },
      },
    });
    const returningUsersPercent =
      totalUsers > 0 ? Math.round((returningUsersCount / totalUsers) * 100) : 0;

    const pastTotal = totalUsers - newThisWeek;
    const growthPercent = pastTotal > 0 ? ((newThisWeek / pastTotal) * 100).toFixed(1) : 0;

    const avgSecs = avgTimeAgg._avg.timeTakenInSeconds || 0;
    const avgMins = Math.round(avgSecs / 60);

    return {
      newToday,
      activeToday,
      returningUsers: `${returningUsersPercent}%`,
      suspended,
      growth: `+${growthPercent}%`,
      avgSessionTime: `${avgMins}m`,
    };
  },
  ["admin-user-intelligence"],
  { revalidate: 60, tags: ["admin", "intelligence"] }
);
