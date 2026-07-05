import { PercentileSnapshot, RankingSnapshot } from '../../models/RankingSnapshots';

export class PercentileEngine {
  public calculate(snapshots: RankingSnapshot[]): Map<string, PercentileSnapshot> {
    const total = snapshots.length;
    const percentiles = new Map<string, PercentileSnapshot>();

    if (total === 0) return percentiles;

    snapshots.forEach((snapshot) => {
      const { rank, candidate } = snapshot;
      
      // Calculate percentile: how many people are below this rank
      const belowCount = total - rank;
      const percentile = (belowCount / total) * 100;
      
      // Calculate top percentage: which top % bucket they fall into
      const topPercentage = (rank / total) * 100;

      percentiles.set(candidate.userId, {
        percentile,
        topPercentage,
        // categoryRank can be populated later if candidates have categories
      });
    });

    return percentiles;
  }
}
