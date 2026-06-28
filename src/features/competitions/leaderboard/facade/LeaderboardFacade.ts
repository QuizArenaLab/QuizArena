import { prisma } from "@/lib/prisma";
import { LeaderboardReadModel, UserRankPosition } from "../read-model/LeaderboardReadModel";
import { LeaderboardKeyGenerator } from "../../ranking/engine/LeaderboardKeyGenerator";

export class LeaderboardFacade {
  /**
   * Loads a highly optimized Leaderboard Read Model using Projections and Snapshots.
   */
  public static async getLeaderboard(
    leaderboardKey: string,
    currentUserId?: string,
    cursor?: string,
    limit: number = 50
  ): Promise<LeaderboardReadModel> {
    // 1. Fetch O(1) Precomputed Projection
    const projection = await prisma.leaderboardProjection.findUnique({
      where: { leaderboardKey }
    });

    if (!projection) {
      throw new Error(`Leaderboard '${leaderboardKey}' not found or not yet generated.`);
    }

    // 2. Fetch Current User Position (Independent Query)
    let currentUserPosition: UserRankPosition | null = null;
    if (currentUserId) {
      const userSnapshot = await prisma.rankingSnapshot.findUnique({
        where: { leaderboardKey_userId: { leaderboardKey, userId: currentUserId } },
        include: { user: { select: { name: true, image: true } } }
      });

      if (userSnapshot) {
        currentUserPosition = {
          userId: userSnapshot.userId,
          name: userSnapshot.user.name || "Unknown",
          image: userSnapshot.user.image,
          rank: userSnapshot.rank,
          score: userSnapshot.score,
          accuracy: userSnapshot.accuracy,
          completionTime: userSnapshot.completionTime,
          percentile: userSnapshot.percentile,
          rankChange: "SAME" as const // Trend engine would calculate this historically
        };
      }
    }

    // 3. Cursor Pagination for Table
    const snapshotQuery = await prisma.rankingSnapshot.findMany({
      where: { leaderboardKey },
      take: limit + 1, // Fetch 1 extra to determine hasNextPage
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { rank: "asc" },
      include: { user: { select: { name: true, image: true } } }
    });

    const hasNextPage = snapshotQuery.length > limit;
    const paginatedRecords = hasNextPage ? snapshotQuery.slice(0, -1) : snapshotQuery;
    const nextCursor = hasNextPage ? paginatedRecords[paginatedRecords.length - 1].id : null;

    const paginatedRankings: UserRankPosition[] = paginatedRecords.map(s => ({
      userId: s.userId,
      name: s.user.name || "Unknown",
      image: s.user.image,
      rank: s.rank,
      score: s.score,
      accuracy: s.accuracy,
      completionTime: s.completionTime,
      percentile: s.percentile,
      rankChange: "SAME" as const
    }));

    // Top Rankings from Projection (Guaranteed fastest read)
    const topRankings = (projection.top3Snapshot as any[])?.map(t => ({
      userId: t.user.id,
      name: t.user.name,
      image: t.user.image,
      rank: t.rank,
      score: t.score,
      accuracy: t.accuracy,
      completionTime: t.completionTime,
      percentile: 99.9, // Approximation for UI
      rankChange: "SAME" as const
    })) || [];

    const meta = LeaderboardKeyGenerator.parse(leaderboardKey);

    return {
      metadata: {
        key: leaderboardKey,
        type: meta.type,
        title: `${meta.type} Leaderboard ${meta.id ? `- ${meta.id}` : ""}`,
        lastUpdated: projection.lastUpdated.toISOString()
      },
      statistics: {
        participantCount: projection.participantCount,
        highestScore: projection.highestScore,
        averageScore: projection.averageScore,
        averageAccuracy: projection.averageAccuracy
      },
      topRankings,
      currentUserPosition,
      paginatedRankings,
      hasNextPage,
      nextCursor
    };
  }
}
