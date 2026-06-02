/**
 * QuizArena — Operational Intelligence Types
 *
 * Centralized types for the intelligence engine.
 */

export type OperationalStatus = "STABLE" | "WATCH" | "DECLINING" | "CRITICAL";

export interface IntelligenceInsight {
  id: string;
  category: "OVERVIEW" | "MODERATOR" | "CONTENT" | "ENGAGEMENT" | "SYSTEM";
  message: string;
  status: OperationalStatus;
  actionableLink?: string;
  actionableLabel?: string;
  timestamp: Date;
}

export interface PlatformOverview {
  totalActiveUsers: number;
  userGrowthPercentage: number;
  totalChallengesPublished: number;
  challengePublishingVelocity: number; // Challenges published in last 7 days vs previous 7 days
  reviewBacklogSize: number;
  backlogGrowthPercentage: number;
  moderationThroughput: number; // Items reviewed in last 7 days
  status: OperationalStatus;
}

export interface ModeratorMetrics {
  id: string;
  name: string;
  username: string;
  itemsReviewedLast7Days: number;
  approvalRate: number; // Percentage
  rejectionRate: number; // Percentage
  status: "ACTIVE" | "INACTIVE" | "INCONSISTENT";
}

export interface ModeratorIntelligence {
  metrics: ModeratorMetrics[];
  totalActiveModerators: number;
  averageThroughput: number;
  status: OperationalStatus;
}

export interface SubjectQualityMetric {
  subject: string;
  averageScore: number;
  failureRate: number; // Percentage of attempts scoring below a threshold
  reportCount: number;
}

export interface ContentQualityMetrics {
  highFailureChallenges: {
    id: string;
    title: string;
    slug: string;
    averageScore: number;
    completionRate: number;
  }[];
  problematicSubjects: SubjectQualityMetric[];
  rejectionTrendPercentage: number; // Rejection rate in last 7 days
  status: OperationalStatus;
}

export interface EngagementIntelligence {
  activeUsersLast7Days: number;
  activeUsersPrevious7Days: number;
  engagementTrendPercentage: number;
  averageCompletionRate: number;
  completionRateTrendPercentage: number;
  status: OperationalStatus;
}

export interface SystemIntelligence {
  errorRates?: number;
  apiLatency?: number;
  databaseLoad?: number;
  infrastructureStatus: OperationalStatus;
}

export interface OperationalIntelligenceData {
  overview: PlatformOverview;
  moderator: ModeratorIntelligence;
  content: ContentQualityMetrics;
  engagement: EngagementIntelligence;
  insights: IntelligenceInsight[];
  lastUpdated: Date;
}

export interface StrategicIntelligenceData extends OperationalIntelligenceData {
  system: SystemIntelligence;
}
