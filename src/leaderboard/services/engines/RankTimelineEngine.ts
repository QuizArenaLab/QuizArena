import { RankingSnapshot, RankTimeline } from '../../models/RankingSnapshots';
import { RankingAggregate } from '../../models/RankingAggregate';

export class RankTimelineEngine {
  public calculate(currentSnapshots: RankingSnapshot[], previousAggregate: RankingAggregate | null): Map<string, RankTimeline> {
    const timelines = new Map<string, RankTimeline>();
    const previousTimelines = previousAggregate?.timelines || new Map<string, RankTimeline>();
    const previousSnapshotsMap = new Map<string, number>();

    if (previousAggregate) {
      previousAggregate.snapshots.forEach(s => {
        previousSnapshotsMap.set(s.candidate.userId, s.rank);
      });
    }

    currentSnapshots.forEach(snapshot => {
      const userId = snapshot.candidate.userId;
      const currentRank = snapshot.rank;
      const previousRank = previousSnapshotsMap.get(userId) || null;
      const prevTimeline = previousTimelines.get(userId);

      let movement: 'UP' | 'DOWN' | 'SAME' | 'NEW' = 'NEW';
      if (previousRank !== null) {
        if (currentRank < previousRank) movement = 'UP';
        else if (currentRank > previousRank) movement = 'DOWN';
        else movement = 'SAME';
      }

      let highestRank = currentRank;
      let lowestRank = currentRank;

      if (prevTimeline) {
        highestRank = Math.min(prevTimeline.highestRank, currentRank);
        lowestRank = Math.max(prevTimeline.lowestRank, currentRank);
      }

      timelines.set(userId, {
        previousRank,
        currentRank,
        movement,
        highestRank,
        lowestRank
      });
    });

    return timelines;
  }
}
