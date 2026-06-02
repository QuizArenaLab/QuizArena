"use server";

/**
 * QuizArena — Operational Intelligence Actions
 *
 * RBAC-protected server actions for the Intelligence Center.
 */

import { requirePermission } from "@/features/rbac/services/guards";
import {
  getPlatformOverview,
  getModeratorIntelligence,
  getContentQualityTrends,
  getEngagementTrends,
  generateOperationalInsights,
  type OperationalIntelligenceData,
  type StrategicIntelligenceData,
} from './intelligence/index';

/**
 * Get operational intelligence for ADMIN level.
 */
export async function getOperationalIntelligence(): Promise<{
  success: boolean;
  data?: OperationalIntelligenceData;
  error?: string;
}> {
  try {
    // Both ADMIN and SUPER_ADMIN have this
    await requirePermission("platform.intelligence");

    const overview = await getPlatformOverview();
    const moderator = await getModeratorIntelligence();
    const content = await getContentQualityTrends();
    const engagement = await getEngagementTrends();

    const insights = generateOperationalInsights({
      overview,
      moderator,
      content,
      engagement,
    });

    const data: OperationalIntelligenceData = {
      overview,
      moderator,
      content,
      engagement,
      insights,
      lastUpdated: new Date(),
    };

    return { success: true, data };
  } catch (error) {
    console.error("Failed to aggregate operational intelligence:", error);
    return { success: false, error: "Failed to generate operational intelligence." };
  }
}

/**
 * Get strategic intelligence (with system/infra data) for SUPER_ADMIN level.
 */
export async function getStrategicIntelligence(): Promise<{
  success: boolean;
  data?: StrategicIntelligenceData;
  error?: string;
}> {
  try {
    await requirePermission("platform.settings");

    const operationalDataResponse = await getOperationalIntelligence();
    if (!operationalDataResponse.success || !operationalDataResponse.data) {
      throw new Error("Failed to fetch base operational data");
    }

    // In a real enterprise app, we'd pull from Prometheus, Datadog, or Vercel API here
    const system = {
      errorRates: 0.12, // Fake telemetry for Phase 6.10
      apiLatency: 45,
      databaseLoad: 12,
      infrastructureStatus: "STABLE" as const,
    };

    const data: StrategicIntelligenceData = {
      ...operationalDataResponse.data,
      system,
    };

    return { success: true, data };
  } catch (error) {
    console.error("Failed to aggregate strategic intelligence:", error);
    return { success: false, error: "Failed to generate strategic intelligence." };
  }
}
