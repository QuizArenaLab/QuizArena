import { StatisticsSnapshot } from './RankingSnapshots';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string; // Hydrated from user service if needed
  score: number;
  accuracy: number;
  completionTimeMs: number;
  submittedAt: Date;
  
  // Timeline info
  movement: 'UP' | 'DOWN' | 'SAME' | 'NEW';
  previousRank: number | null;
  
  // Percentile info
  percentile: number;
  topPercentage: number;
}

export interface LeaderboardSummary {
  competitionId: string;
  scope: string;
  totalParticipants: number;
  lastUpdatedAt: Date;
  topEntries: LeaderboardEntry[]; // e.g. top 3 or top 10
}

export interface LeaderboardStatistics {
  competitionId: string;
  statistics: StatisticsSnapshot;
}

export interface LeaderboardCurrentUser {
  entry: LeaderboardEntry | null;
  highestRank: number | null;
  lowestRank: number | null;
}

export interface LeaderboardFilters {
  availableScopes: string[];
  availableCategories: string[];
}

export interface LeaderboardPagination {
  nextCursor: string | null;
  prevCursor: string | null;
  hasMore: boolean;
  totalCount: number;
}
