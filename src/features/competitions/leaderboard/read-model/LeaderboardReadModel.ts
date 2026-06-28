export interface LeaderboardMetadata {
  key: string;
  type: string;
  title: string;
  lastUpdated: string;
}

export interface UserRankPosition {
  userId: string;
  name: string;
  image: string | null;
  rank: number;
  score: number;
  accuracy: number;
  completionTime: number;
  percentile: number;
  rankChange: "UP" | "DOWN" | "SAME" | "NEW";
}

export interface LeaderboardStatistics {
  participantCount: number;
  highestScore: number;
  averageScore: number;
  averageAccuracy: number;
}

export interface LeaderboardReadModel {
  metadata: LeaderboardMetadata;
  statistics: LeaderboardStatistics;
  topRankings: UserRankPosition[];
  currentUserPosition: UserRankPosition | null;
  
  // Pagination
  paginatedRankings: UserRankPosition[];
  hasNextPage: boolean;
  nextCursor: string | null;
}
