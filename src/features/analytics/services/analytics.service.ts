import { prisma } from "@/lib/prisma";
import { AttemptStatus } from "@/generated/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { cache } from "react";

/**
 * Service to handle pre-computed snapshots for user analytics.
 * This ensures O(1) read performance for all dashboards and components.
 */
export class AnalyticsService {
  /**
   * Retrieves the user's performance snapshot.
   * If it doesn't exist, generates one from legacy data to prevent missing stats.
   */
  static getPerformanceSnapshot = cache(async (userId: string) => {
    let snapshot = await prisma.userPerformanceSnapshot.findUnique({
      where: { userId },
    });

    if (!snapshot) {
      // Lazy initialization fallback using legacy UserPerformanceProfile
      const profile = await prisma.userPerformanceProfile.findUnique({ where: { userId } });
      const bestRankEntry = await prisma.leaderboardEntry.findFirst({
        where: { userId },
        orderBy: { rank: "asc" },
      });

      snapshot = await prisma.userPerformanceSnapshot.upsert({
        where: { userId },
        create: {
          userId,
          overallAccuracy: profile?.averageAccuracy ?? 0,
          currentRank: bestRankEntry?.rank ?? null,
          currentStreak: profile?.currentStreak ?? 0,
          highestStreak: profile?.longestStreak ?? 0,
          bestCategory: profile?.strongestCategory ?? null,
          weakestCategory: profile?.weakestCategory ?? null,
          totalAttempts: profile?.totalAttempts ?? 0,
          competitionsPlayed: profile?.completedAttempts ?? 0, // Using completed as proxy
        },
        update: {},
      });
    }

    return snapshot;
  });

  /**
   * Called by the evaluation pipeline when an attempt is submitted and evaluated.
   * Updates the performance snapshot asynchronously.
   */
  static async updateSnapshotAfterEvaluation(userId: string) {
    // 1. Fetch comprehensive metrics
    const [profile, categoryPerfs, bestRankEntry, totalAttemptsCount, competitionsCount] =
      await Promise.all([
        prisma.userPerformanceProfile.findUnique({ where: { userId } }),
        prisma.userCategoryPerformance.findMany({
          where: { userId },
          orderBy: { averageAccuracy: "desc" },
        }),
        prisma.leaderboardEntry.findFirst({
          where: { userId },
          orderBy: { rank: "asc" },
        }),
        prisma.attempt.count({ where: { userId, status: AttemptStatus.EVALUATED } }),
        prisma.attempt.count({
          where: { userId, status: AttemptStatus.EVALUATED, challenge: { visibility: "PUBLIC" } },
        }),
      ]);

    const overallAccuracy = profile?.averageAccuracy ?? 0;
    const bestCategory = categoryPerfs.length > 0 ? categoryPerfs[0].category : null;
    const weakestCategory =
      categoryPerfs.length > 1 ? categoryPerfs[categoryPerfs.length - 1].category : null;

    // 2. Upsert Snapshot
    await prisma.userPerformanceSnapshot.upsert({
      where: { userId },
      update: {
        overallAccuracy,
        currentRank: bestRankEntry?.rank ?? null,
        currentStreak: profile?.currentStreak ?? 0,
        highestStreak: profile?.longestStreak ?? 0,
        bestCategory,
        weakestCategory,
        totalAttempts: totalAttemptsCount,
        competitionsPlayed: competitionsCount,
        lastUpdatedAt: new Date(),
      },
      create: {
        userId,
        overallAccuracy,
        currentRank: bestRankEntry?.rank ?? null,
        currentStreak: profile?.currentStreak ?? 0,
        highestStreak: profile?.longestStreak ?? 0,
        bestCategory,
        weakestCategory,
        totalAttempts: totalAttemptsCount,
        competitionsPlayed: competitionsCount,
      },
    });

    // 3. Invalidate caches
    revalidatePath("/dashboard");
    revalidatePath("/profile");
    // revalidateTag(`user-snapshot-${userId}`);
  }
}
