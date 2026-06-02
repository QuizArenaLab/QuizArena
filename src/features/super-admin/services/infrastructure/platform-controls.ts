"use server";

import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/features/super-admin/services/governance";
import { revalidatePath } from "next/cache";

import { INFRASTRUCTURE_KEYS, type InfrastructureKey } from "./keys";

interface FeatureState {
  enabled: boolean;
  message?: string;
}

/**
 * Ensures a platform setting exists, creating it with default values if it doesn't.
 */
async function ensureSettingExists(key: string, defaultValue: FeatureState) {
  const existing = await prisma.platformSetting.findUnique({
    where: { key },
  });

  if (!existing) {
    await prisma.platformSetting.create({
      data: {
        key,
        value: JSON.stringify(defaultValue),
        category: "INFRASTRUCTURE",
        isProtected: true,
      },
    });
    return defaultValue;
  }

  return JSON.parse(existing.value as string) as FeatureState;
}

/**
 * Retrieves the global platform state directly (safely callable from anywhere).
 * Fast query, minimal processing.
 */
export async function getPlatformState(): Promise<{
  maintenanceMode: FeatureState;
  registration: FeatureState;
  challengeSystem: FeatureState;
  moderationWorkflows: FeatureState;
  analyticsSystem: FeatureState;
  leaderboard: FeatureState;
}> {
  let settings: any[] = [];

  try {
    settings = await prisma.platformSetting.findMany({
      where: { category: "INFRASTRUCTURE" },
    });
  } catch (error: any) {
    // If the database is completely unreachable or times out, catch the error
    // to prevent the entire Next.js root layout from crashing.
    // Use console.warn instead of console.error to prevent Next.js from triggering the dev error overlay.
    console.warn(
      "[getPlatformState] Database unreachable, falling back to default states. Error:",
      error?.message || "Unknown error"
    );
  }

  const getSetting = (key: string, defaultEnabled: boolean): FeatureState => {
    const setting = settings.find((s) => s.key === key);
    if (!setting) return { enabled: defaultEnabled };
    try {
      return JSON.parse(setting.value as string) as FeatureState;
    } catch {
      return { enabled: defaultEnabled };
    }
  };

  return {
    maintenanceMode: getSetting(INFRASTRUCTURE_KEYS.MAINTENANCE_MODE, false),
    registration: getSetting(INFRASTRUCTURE_KEYS.REGISTRATION_ENABLED, true),
    challengeSystem: getSetting(INFRASTRUCTURE_KEYS.CHALLENGE_SYSTEM_ENABLED, true),
    moderationWorkflows: getSetting(INFRASTRUCTURE_KEYS.MODERATION_WORKFLOWS_ENABLED, true),
    analyticsSystem: getSetting(INFRASTRUCTURE_KEYS.ANALYTICS_SYSTEM_ENABLED, true),
    leaderboard: getSetting(INFRASTRUCTURE_KEYS.LEADERBOARD_ENABLED, true),
  };
}

/**
 * Securely updates a platform feature control. SUPER_ADMIN only.
 */
export async function updateFeatureControl(
  key: InfrastructureKey,
  state: FeatureState,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await requireSuperAdmin();

    const previousValue = await ensureSettingExists(key, { enabled: true });

    await prisma.$transaction(async (tx) => {
      // 1. Update the setting
      await tx.platformSetting.update({
        where: { key },
        data: {
          value: JSON.stringify(state),
          updatedById: session.userId,
        },
      });

      // 2. Audit log the setting change specifically
      await tx.settingAudit.create({
        data: {
          settingKey: key,
          previousValue: JSON.stringify(previousValue),
          newValue: JSON.stringify(state),
          reason,
          changedById: session.userId,
        },
      });

      // 3. Add to governance audit log
      await tx.auditLog.create({
        data: {
          action: "INFRASTRUCTURE_UPDATE",
          actorId: session.userId,
          entityId: key,
          entityType: "SYSTEM",
          severity: key === INFRASTRUCTURE_KEYS.MAINTENANCE_MODE ? "CRITICAL" : "HIGH",
          ipAddress: "server",
          userAgent: "server-action",
          metadata: JSON.stringify({ key, previous: previousValue, new: state, reason }),
        },
      });
    });

    revalidatePath("/", "layout"); // Revalidate entire app structure
    return { success: true };
  } catch (error) {
    console.error("[updateFeatureControl]", error);
    return { success: false, error: "Failed to update infrastructure setting" };
  }
}

/**
 * Special handler for Maintenance Mode enablement
 */
export async function enableMaintenanceMode(
  message: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  return updateFeatureControl(
    INFRASTRUCTURE_KEYS.MAINTENANCE_MODE,
    { enabled: true, message },
    reason
  );
}

/**
 * Special handler for Maintenance Mode disablement
 */
export async function disableMaintenanceMode(
  reason: string
): Promise<{ success: boolean; error?: string }> {
  return updateFeatureControl(INFRASTRUCTURE_KEYS.MAINTENANCE_MODE, { enabled: false }, reason);
}
