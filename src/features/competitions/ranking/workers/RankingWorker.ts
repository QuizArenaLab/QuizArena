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

    // 1. Fetch all submission records for this competition that have results
    const submissions = await prisma.submissionRecord.findMany({
      where: {
        attempt: { competitionId },
        result: { isNot: null },
      },
      include: {
        attempt: true,
        result: true,
      },
    });

    if (submissions.length === 0) return;

    // 2. Format for strategy
    const participants = submissions.map((s) => ({
      userId: s.userId,
      score: s.result!.score,
      accuracy: s.result!.accuracy,
      completionTime: s.attempt.timeTakenInSeconds,
      submittedAt: s.submittedAt,
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
        where: { leaderboardKey },
      });

      // Insert new snapshots in batches (for massive leaderboards, we'd batch this)
      await tx.rankingSnapshot.createMany({
        data: ranked.map((r) => ({
          leaderboardKey,
          userId: r.userId,
          score: r.score,
          accuracy: r.accuracy,
          completionTime: r.completionTime,
          rank: r.rank,
          percentile: r.percentile,
        })),
      });
    });

    console.log(
      `[RankingWorker] Ranking generated for ${leaderboardKey}. Triggering Projection...`
    );

    // In a full event-driven system, we'd emit 'RankingSnapshotGenerated' here
    // For this execution, we'll invoke the Projection Generator directly.
    await ProjectionGenerator.generate(leaderboardKey, ranked);
  }
}
