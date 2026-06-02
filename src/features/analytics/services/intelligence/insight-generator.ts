/**
 * QuizArena — Insight Generator
 *
 * Generates human-readable, strategic operational insights
 * and ties them to actionable workflows.
 */

import type {
  IntelligenceInsight,
  PlatformOverview,
  ModeratorIntelligence,
  ContentQualityMetrics,
  EngagementIntelligence,
} from "./types";
import { detectAnomalies } from "./anomaly-detector";

export function generateOperationalInsights(data: {
  overview: PlatformOverview;
  moderator: ModeratorIntelligence;
  content: ContentQualityMetrics;
  engagement: EngagementIntelligence;
}): IntelligenceInsight[] {
  const insights: IntelligenceInsight[] = [];
  const anomalies = detectAnomalies(data);

  // Translate anomalies into insights
  for (const anomaly of anomalies) {
    let category: IntelligenceInsight["category"] = "OVERVIEW";
    let link: string | undefined;
    let label: string | undefined;

    if (anomaly.metric === "Review Backlog" || anomaly.metric === "Moderation Flow") {
      category = "MODERATOR";
      link = "/dashboard/admin/reports"; // or moderation queue
      label = "Open Moderation Queue";
    } else if (anomaly.metric === "Active Users") {
      category = "ENGAGEMENT";
      link = "/dashboard/admin/monitoring?tab=trends";
      label = "View Engagement Analytics";
    } else if (anomaly.metric === "Rejection Rate") {
      category = "CONTENT";
      link = "/dashboard/admin/reports";
      label = "Review Rejected Content";
    }

    insights.push({
      id: `anom-${Date.now()}-${Math.random()}`,
      category,
      message: anomaly.context,
      status: anomaly.severity === "CRITICAL" ? "CRITICAL" : "DECLINING",
      actionableLink: link,
      actionableLabel: label,
      timestamp: new Date(),
    });
  }

  // Generate trend-based insights
  if (data.engagement.completionRateTrendPercentage < -5) {
    insights.push({
      id: `trend-eng-comp-${Date.now()}`,
      category: "ENGAGEMENT",
      message: `Challenge completion dropped ${Math.abs(data.engagement.completionRateTrendPercentage)}% this week.`,
      status: "WATCH",
      actionableLink: "/dashboard/admin/monitoring",
      actionableLabel: "View Performance",
      timestamp: new Date(),
    });
  }

  if (data.content.problematicSubjects.length > 0) {
    const topSubject = data.content.problematicSubjects[0];
    insights.push({
      id: `trend-subj-${Date.now()}`,
      category: "CONTENT",
      message: `The '${topSubject.subject}' category shows a high failure rate (${topSubject.failureRate.toFixed(1)}%).`,
      status: "WATCH",
      actionableLink: "/dashboard/admin/reports",
      actionableLabel: "Audit Category Content",
      timestamp: new Date(),
    });
  }

  // Positive insights
  if (data.overview.userGrowthPercentage > 10) {
    insights.push({
      id: `trend-growth-${Date.now()}`,
      category: "OVERVIEW",
      message: `Platform user base grew solidly by ${data.overview.userGrowthPercentage}% this week.`,
      status: "STABLE",
      timestamp: new Date(),
    });
  }

  return insights.sort((a, b) => {
    const statusWeight = { CRITICAL: 4, DECLINING: 3, WATCH: 2, STABLE: 1 };
    return statusWeight[b.status] - statusWeight[a.status];
  });
}
