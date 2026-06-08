import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export class LeaderboardService {
  /**
   * Retrieves the global leaderboard snapshot, initializing it if necessary.
   */
  static async getGlobalSnapshot() {
    let snapshot = await prisma.leaderboardSnapshot.findFirst();

    if (!snapshot) {
      // Lazy initialization
      const totalParticipants = await prisma.leaderboardEntry.count();
      const activeCompetitions = await prisma.challenge.count({
        where: { status: "LIVE" },
      });

      snapshot = await prisma.leaderboardSnapshot.create({
        data: {
          totalParticipants,
          activeCompetitions,
          rankingMetadata: {},
          cachedLeaderboardStats: {},
        },
      });
    }

    return snapshot;
  }

  /**
   * Cached read for challenge-specific participant counts.
   * This eliminates live COUNT(*) queries during page rendering.
   * Revalidates every 15 minutes.
   */
  static getChallengeParticipantCount = unstable_cache(
    async (challengeId: string) => {
      const snapshot = await prisma.leaderboardSnapshot.findFirst();
      if (snapshot?.cachedLeaderboardStats) {
        const stats = snapshot.cachedLeaderboardStats as Record<string, any>;
        if (typeof stats[challengeId] === "number") {
          return stats[challengeId] as number;
        }
      }

      // Fallback if not in snapshot
      return prisma.leaderboardEntry.count({
        where: { challengeId },
      });
    },
    ["challenge-participant-count"],
    { revalidate: 900 }
  );

  /**
   * Updates the global snapshot and caches the new count for a challenge.
   * Called during challenge completion evaluation.
   */
  static async updateSnapshotAfterCompletion(challengeId: string) {
    const [totalParticipants, activeCompetitions, challengeCount] = await Promise.all([
      prisma.leaderboardEntry.count(),
      prisma.challenge.count({ where: { status: "LIVE" } }),
      prisma.leaderboardEntry.count({ where: { challengeId } }),
    ]);

    const snapshot = await prisma.leaderboardSnapshot.findFirst();

    if (snapshot) {
      const stats = (snapshot.cachedLeaderboardStats as Record<string, any>) || {};
      stats[challengeId] = challengeCount;

      await prisma.leaderboardSnapshot.update({
        where: { id: snapshot.id },
        data: {
          totalParticipants,
          activeCompetitions,
          cachedLeaderboardStats: stats,
          lastUpdatedAt: new Date(),
        },
      });
    } else {
      await prisma.leaderboardSnapshot.create({
        data: {
          totalParticipants,
          activeCompetitions,
          cachedLeaderboardStats: { [challengeId]: challengeCount },
        },
      });
    }
  }
}
