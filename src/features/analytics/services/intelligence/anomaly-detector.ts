/**
 * QuizArena — Operational Anomaly Detector
 *
 * Detects abnormal platform behavior across moderation, engagement, and infrastructure.
 */

import type {
  PlatformOverview,
  ModeratorIntelligence,
  ContentQualityMetrics,
  EngagementIntelligence,
} from "./types";

export interface Anomaly {
  type: "SPIKE" | "DROP" | "STALL" | "INCONSISTENCY";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  context: string;
  metric: string;
}

export function detectAnomalies(data: {
  overview: PlatformOverview;
  moderator: ModeratorIntelligence;
  content: ContentQualityMetrics;
  engagement: EngagementIntelligence;
}): Anomaly[] {
  const anomalies: Anomaly[] = [];

  // 1. Backlog Anomalies
  if (data.overview.backlogGrowthPercentage > 50) {
    anomalies.push({
      type: "SPIKE",
      severity: "HIGH",
      context: `Moderation backlog grew by ${data.overview.backlogGrowthPercentage}%`,
      metric: "Review Backlog",
    });
  }

  // 2. Engagement Anomalies
  if (data.engagement.engagementTrendPercentage < -15) {
    anomalies.push({
      type: "DROP",
      severity: "CRITICAL",
      context: `Active users dropped by ${Math.abs(data.engagement.engagementTrendPercentage)}%`,
      metric: "Active Users",
    });
  }

  // 3. Moderation Stalls
  if (data.overview.reviewBacklogSize > 100 && data.overview.moderationThroughput < 10) {
    anomalies.push({
      type: "STALL",
      severity: "CRITICAL",
      context: `Backlog is ${data.overview.reviewBacklogSize} but throughput is critically low`,
      metric: "Moderation Flow",
    });
  }

  // 4. Content Quality Drops
  if (data.content.rejectionTrendPercentage > 40) {
    anomalies.push({
      type: "SPIKE",
      severity: "HIGH",
      context: `Content rejection rate is abnormally high at ${data.content.rejectionTrendPercentage.toFixed(1)}%`,
      metric: "Rejection Rate",
    });
  }

  return anomalies;
}
