import { prisma } from "@/lib/prisma";
import { RankingStrategyRegistry } from "../registry/RankingStrategyRegistry";
import { LeaderboardKeyGenerator } from "../engine/LeaderboardKeyGenerator";
import { ProjectionGenerator } from "./ProjectionGenerator";

export class RankingWorker {
  /**
   * Recalculates ranking for a specific leaderboard key asynchronously.
   * This is triggered by a Domain Event.
   */
  public static async executeCompetitionRanking(competitionId: string) {
    console.log(`[RankingWorker] Executing ranking for competition: ${competitionId}`);
    
    // 1. Fetch all attempts for this competition that are COMPLETED/SUBMITTED
    const attempts = await prisma.competitionAttempt.findMany({
      where: { 
        competitionId,
        session: { status: "SUBMITTED" }
      },
      select: {
        userId: true,
        score: true,
        accuracy: true,
        timeTakenInSeconds: true,
        submittedAt: true
      }
    });

    if (attempts.length === 0) return;

    // 2. Format for strategy
    const participants = attempts.map(a => ({
      userId: a.userId,
      score: a.score,
      accuracy: a.accuracy,
      completionTime: a.timeTakenInSeconds,
      submittedAt: a.submittedAt
    }));

    // 3. Compute Rankings
    const strategy = RankingStrategyRegistry.getStrategy("DEFAULT");
    const ranked = strategy.computeRankings(participants);

    // 4. Generate Leaderboard Key
    const leaderboardKey = LeaderboardKeyGenerator.competition(competitionId);

    // 5. Update Ranking Snapshots (Transactional)
    await prisma.$transaction(async (tx) => {
      // Clear old snapshot for this key
      await tx.rankingSnapshot.deleteMany({
        where: { leaderboardKey }
      });

      // Insert new snapshots in batches (for massive leaderboards, we'd batch this)
      await tx.rankingSnapshot.createMany({
        data: ranked.map(r => ({
          leaderboardKey,
          userId: r.userId,
          score: r.score,
          accuracy: r.accuracy,
          completionTime: r.completionTime,
          rank: r.rank,
          percentile: r.percentile
        }))
      });
    });

    console.log(`[RankingWorker] Ranking generated for ${leaderboardKey}. Triggering Projection...`);
    
    // In a full event-driven system, we'd emit 'RankingSnapshotGenerated' here
    // For this execution, we'll invoke the Projection Generator directly.
    await ProjectionGenerator.generate(leaderboardKey, ranked);
  }
}
