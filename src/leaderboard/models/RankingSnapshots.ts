import { RankingCandidateSnapshot } from '../types/RankingCandidateSnapshot';

export interface RankingSnapshot {
  rank: number;
  candidate: RankingCandidateSnapshot;
}

export interface RankTimeline {
  previousRank: number | null;
  currentRank: number;
  movement: 'UP' | 'DOWN' | 'SAME' | 'NEW';
  highestRank: number;
  lowestRank: number;
}

export interface PercentileSnapshot {
  percentile: number;
  topPercentage: number;
  categoryRank?: number;
}

export interface StatisticsSnapshot {
  competitionAverageScore: number;
  medianScore: number;
  highestScore: number;
  lowestScore: number;
  distribution: Record<string, number>; // e.g. "90-100": 15
  participationCount: number;
}

export interface RankingManifest {
  schemaVersion: string;
  algorithmVersion: string;
  generatedAt: Date;
  materializerVersion: string;
  platformVersion: string;
  artifactVersion: string;
  generatedBy: string;
  generationDuration: number;
  candidateCount: number;
  rankingCount: number;
  runtimeVersion: string;
  submissionVersion: string;
}

export interface LeaderboardAudit {
  id: string;
  startedAt: Date;
  finishedAt: Date;
  durationMs: number;
  candidatesProcessed: number;
  failures: number;
  retryCount: number;
  algorithmVersion: string;
  generatedBy: string;
  trigger: 'Immediate' | 'Interval' | 'CompetitionCompleted' | 'Manual';
}
