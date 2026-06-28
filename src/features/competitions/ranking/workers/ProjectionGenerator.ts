import { prisma } from "@/lib/prisma";
import { RankedParticipant } from "../registry/RankingStrategyRegistry";

export class ProjectionGenerator {
  /**
   * Precomputes leaderboard statistics and top-3 so the UI can load instantly O(1).
   */
  public static async generate(leaderboardKey: string, ranked: RankedParticipant[]) {
    console.log(`[ProjectionGenerator] Building projection for: ${leaderboardKey}`);
    
    if (ranked.length === 0) return;

    const participantCount = ranked.length;
    const highestScore = Math.max(...ranked.map(r => r.score));
    
    const sumScore = ranked.reduce((acc, r) => acc + r.score, 0);
    const averageScore = sumScore / participantCount;
    
    const sumAccuracy = ranked.reduce((acc, r) => acc + r.accuracy, 0);
    const averageAccuracy = sumAccuracy / participantCount;

    // Get Top 3 with User details
    const top3 = ranked.filter(r => r.rank <= 3).sort((a, b) => a.rank - b.rank);
    
    const users = await prisma.user.findMany({
      where: { id: { in: top3.map(t => t.userId) } },
      select: { id: true, name: true, image: true }
    });

    const top3Snapshot = top3.map(t => {
      const user = users.find(u => u.id === t.userId);
      return {
        rank: t.rank,
        score: t.score,
        accuracy: t.accuracy,
        completionTime: t.completionTime,
        user: {
          id: user?.id,
          name: user?.name || "Unknown",
          image: user?.image
        }
      };
    });

    // Upsert Projection
    await prisma.leaderboardProjection.upsert({
      where: { leaderboardKey },
      update: {
        participantCount,
        highestScore,
        averageScore,
        averageAccuracy,
        top3Snapshot: top3Snapshot as any
      },
      create: {
        leaderboardKey,
        participantCount,
        highestScore,
        averageScore,
        averageAccuracy,
        top3Snapshot: top3Snapshot as any
      }
    });

    console.log(`[ProjectionGenerator] Projection complete for ${leaderboardKey}.`);
  }
}
