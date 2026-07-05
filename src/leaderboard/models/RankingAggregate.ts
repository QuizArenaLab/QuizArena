import {
  RankingSnapshot,
  RankTimeline,
  PercentileSnapshot,
  StatisticsSnapshot,
  RankingManifest,
  LeaderboardAudit
} from './RankingSnapshots';

export interface RankingAggregate {
  aggregateId: string;
  competitionId: string;
  leaderboardScope: string;
  
  // The materialized ranking
  snapshots: RankingSnapshot[];
  
  // Historical data per user
  timelines: Map<string, RankTimeline>;
  
  // Percentile data per user
  percentiles: Map<string, PercentileSnapshot>;
  
  // Statistics for the entire leaderboard
  statistics: StatisticsSnapshot;
  
  // Provenance and versioning
  manifest: RankingManifest;
  audit: LeaderboardAudit;

  // Version Compatibility (Enforced)
  submissionVersion: string;
  artifactVersion: string;
  platformVersion: string;
  schemaVersion: string;
  leaderboardVersion: string;
}
