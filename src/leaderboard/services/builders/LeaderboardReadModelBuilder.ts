import { RankingAggregate } from '../../models/RankingAggregate';
import { LeaderboardSummary, LeaderboardEntry, LeaderboardStatistics, LeaderboardCurrentUser } from '../../models/LeaderboardReadModels';
import { RankingSnapshot } from '../../models/RankingSnapshots';

export class LeaderboardReadModelBuilder {
  public buildSummary(aggregate: RankingAggregate, limit: number = 10): LeaderboardSummary {
    const topSnapshots = aggregate.snapshots.slice(0, limit);
    const topEntries = topSnapshots.map(s => this.buildEntry(aggregate, s));

    return {
      competitionId: aggregate.competitionId,
      scope: aggregate.leaderboardScope,
      totalParticipants: aggregate.manifest.rankingCount,
      lastUpdatedAt: aggregate.manifest.generatedAt,
      topEntries
    };
  }

  public buildStatistics(aggregate: RankingAggregate): LeaderboardStatistics {
    return {
      competitionId: aggregate.competitionId,
      statistics: aggregate.statistics
    };
  }

  public buildCurrentUser(aggregate: RankingAggregate, userId: string): LeaderboardCurrentUser {
    const snapshot = aggregate.snapshots.find(s => s.candidate.userId === userId);
    const timeline = aggregate.timelines.get(userId);

    if (!snapshot) {
      return {
        entry: null,
        highestRank: null,
        lowestRank: null
      };
    }

    return {
      entry: this.buildEntry(aggregate, snapshot),
      highestRank: timeline ? timeline.highestRank : snapshot.rank,
      lowestRank: timeline ? timeline.lowestRank : snapshot.rank
    };
  }

  public buildEntry(aggregate: RankingAggregate, snapshot: RankingSnapshot): LeaderboardEntry {
    const candidate = snapshot.candidate;
    const timeline = aggregate.timelines.get(candidate.userId);
    const percentile = aggregate.percentiles.get(candidate.userId);

    return {
      rank: snapshot.rank,
      userId: candidate.userId,
      username: `User_${candidate.userId.substring(0, 5)}`, // Needs hydration from User service normally
      score: candidate.score,
      accuracy: candidate.accuracy,
      completionTimeMs: candidate.completionTime,
      submittedAt: candidate.submittedAt,
      movement: timeline ? timeline.movement : 'NEW',
      previousRank: timeline ? timeline.previousRank : null,
      percentile: percentile ? percentile.percentile : 0,
      topPercentage: percentile ? percentile.topPercentage : 100
    };
  }
}
