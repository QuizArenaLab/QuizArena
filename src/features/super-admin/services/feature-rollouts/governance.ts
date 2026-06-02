/**
 * QuizArena — Feature Rollout Governance
 *
 * Super Admin operational controls for feature flags.
 * Includes explicit high-risk safeguards and sovereign audit enforcement.
 */

import { prisma } from "@/lib/prisma";
import { logSuperAdminAudit } from "../audit";
import type { FeatureFlagPayload } from "@/types/super-admin-rollouts";
import type { Role } from "@/features/rbac/services/roles";
import type { Prisma } from "@/generated/prisma";

/**
 * Creates a new feature rollout configuration.
 */
export async function createFeatureRollout(
  adminId: string,
  adminRole: Role,
  adminEmail: string,
  data: Omit<FeatureFlagPayload, "id" | "createdAtISO" | "updatedAtISO" | "creator" | "updater">
) {
  const flag = await prisma.featureFlag.create({
    data: {
      key: data.key,
      name: data.name,
      enabled: data.enabled,
      rolloutType: data.rolloutType,
      rolloutValue: data.rolloutValue,
      environments: data.environments as unknown as Prisma.InputJsonObject,
      createdById: adminId,
      updatedById: adminId,
    },
  });

  await logSuperAdminAudit({
    actorId: adminId,
    actorRole: adminRole,
    actorEmail: adminEmail,
    action: "CREATE_FEATURE_ROLLOUT",
    category: "FEATURE_ROLLOUT",
    targetId: flag.id,
    targetType: "FeatureFlag",
    details: { key: flag.key, type: flag.rolloutType, enabled: flag.enabled },
    riskSeverity: "HIGH",
    infrastructureImpact: "New feature rollout architecture deployed",
    timestamp: new Date(),
  });

  return flag;
}

/**
 * Instantly kills a feature rollout (Rollback Governance).
 */
export async function rollbackFeature(
  adminId: string,
  adminRole: Role,
  adminEmail: string,
  featureKey: string,
  reason: string
) {
  const flag = await prisma.featureFlag.update({
    where: { key: featureKey },
    data: { enabled: false, updatedById: adminId },
  });

  await logSuperAdminAudit({
    actorId: adminId,
    actorRole: adminRole,
    actorEmail: adminEmail,
    action: "ROLLBACK_FEATURE_ROLLOUT",
    category: "FEATURE_ROLLOUT",
    targetId: flag.id,
    targetType: "FeatureFlag",
    details: { key: flag.key, reason },
    riskSeverity: "CRITICAL",
    infrastructureImpact: "Immediate sovereign rollback of feature rollout",
    timestamp: new Date(),
  });

  return flag;
}

/**
 * Enables a feature rollout.
 */
export async function enableFeature(
  adminId: string,
  adminRole: Role,
  adminEmail: string,
  featureKey: string
) {
  const flag = await prisma.featureFlag.update({
    where: { key: featureKey },
    data: { enabled: true, updatedById: adminId },
  });

  await logSuperAdminAudit({
    actorId: adminId,
    actorRole: adminRole,
    actorEmail: adminEmail,
    action: "ENABLE_FEATURE_ROLLOUT",
    category: "FEATURE_ROLLOUT",
    targetId: flag.id,
    targetType: "FeatureFlag",
    details: { key: flag.key },
    riskSeverity: "HIGH",
    infrastructureImpact: "Feature rollout enabled for evaluated contexts",
    timestamp: new Date(),
  });

  return flag;
}

/**
 * Updates a feature rollout configuration.
 */
export async function updateRollout(
  adminId: string,
  adminRole: Role,
  adminEmail: string,
  featureKey: string,
  updates: Partial<
    Pick<
      FeatureFlagPayload,
      "name" | "description" | "rolloutType" | "rolloutValue" | "environments"
    >
  >
) {
  const flag = await prisma.featureFlag.update({
    where: { key: featureKey },
    data: {
      ...updates,
      environments: updates.environments as unknown as Prisma.InputJsonObject | undefined,
      updatedById: adminId,
    },
  });

  await logSuperAdminAudit({
    actorId: adminId,
    actorRole: adminRole,
    actorEmail: adminEmail,
    action: "UPDATE_FEATURE_ROLLOUT",
    category: "FEATURE_ROLLOUT",
    targetId: flag.id,
    targetType: "FeatureFlag",
    details: { key: flag.key, updates },
    riskSeverity: "MEDIUM",
    infrastructureImpact: "Feature rollout parameters modified",
    timestamp: new Date(),
  });

  return flag;
}
