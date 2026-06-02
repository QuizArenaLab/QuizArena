/**
 * QuizArena — Feature Rollout Analytics
 *
 * Data aggregation for the Rollout Governance Dashboard.
 */

import { prisma } from "@/lib/prisma";
import type {
  FeatureGovernanceData,
  FeatureFlagPayload,
  RolloutStats,
  RolloutEnvironments,
} from "@/types/super-admin-rollouts";
import { RolloutType } from "@/generated/prisma";
import type { Role } from "@/features/rbac/services/roles";

export async function getFeatureRolloutsData(): Promise<FeatureGovernanceData> {
  const flags = await prisma.featureFlag.findMany({
    include: {
      createdBy: { select: { id: true, name: true, email: true, role: true } },
      updatedBy: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const payload: FeatureFlagPayload[] = flags.map((f) => ({
    id: f.id,
    key: f.key,
    name: f.name,
    description: f.description,
    enabled: f.enabled,
    rolloutType: f.rolloutType as RolloutType,
    rolloutValue: f.rolloutValue,
    environments: (f.environments as unknown as RolloutEnvironments) || {
      development: true,
      staging: true,
      production: false,
    },
    createdAtISO: f.createdAt.toISOString(),
    updatedAtISO: f.updatedAt.toISOString(),
    creator: f.createdBy
      ? {
          id: f.createdBy.id,
          name: f.createdBy.name,
          email: f.createdBy.email,
          role: f.createdBy.role as Role,
        }
      : null,
    updater: f.updatedBy
      ? {
          id: f.updatedBy.id,
          name: f.updatedBy.name,
          email: f.updatedBy.email,
          role: f.updatedBy.role as Role,
        }
      : null,
  }));

  const stats: RolloutStats = {
    totalFeatures: flags.length,
    activeFeatures: flags.filter((f) => f.enabled).length,
    percentageRollouts: flags.filter((f) => f.enabled && f.rolloutType === RolloutType.PERCENTAGE)
      .length,
    experimentalFeatures: flags.filter((f) => f.enabled && f.rolloutType === RolloutType.USER_BASED)
      .length,
    disabledFeatures: flags.filter((f) => !f.enabled).length,
    highRiskFeatures: flags.filter(
      (f) =>
        f.key.includes("auth") ||
        f.key.includes("infra") ||
        f.key.includes("security") ||
        f.key.includes("governance")
    ).length,
  };

  return {
    stats,
    flags: payload,
    lastAggregatedISO: new Date().toISOString(),
  };
}
