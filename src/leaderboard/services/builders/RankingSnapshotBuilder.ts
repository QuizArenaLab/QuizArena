import { RankingSnapshot, PercentileSnapshot, RankTimeline, StatisticsSnapshot } from '../../models/RankingSnapshots';

export interface RankingSnapshotData {
  snapshots: RankingSnapshot[];
  percentiles: Map<string, PercentileSnapshot>;
  timelines: Map<string, RankTimeline>;
  statistics: StatisticsSnapshot;
}

export class RankingSnapshotBuilder {
  private snapshots: RankingSnapshot[] = [];
  private percentiles: Map<string, PercentileSnapshot> = new Map();
  private timelines: Map<string, RankTimeline> = new Map();
  private statistics: StatisticsSnapshot | null = null;

  public withSnapshots(snapshots: RankingSnapshot[]): this {
    this.snapshots = snapshots;
    return this;
  }

  public withPercentiles(percentiles: Map<string, PercentileSnapshot>): this {
    this.percentiles = percentiles;
    return this;
  }

  public withTimelines(timelines: Map<string, RankTimeline>): this {
    this.timelines = timelines;
    return this;
  }

  public withStatistics(statistics: StatisticsSnapshot): this {
    this.statistics = statistics;
    return this;
  }

  public build(): RankingSnapshotData {
    if (!this.statistics) {
      throw new Error('Statistics must be provided to build snapshots');
    }
    return {
      snapshots: this.snapshots,
      percentiles: this.percentiles,
      timelines: this.timelines,
      statistics: this.statistics
    };
  }
}
