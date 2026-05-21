"use server";

/**
 * QuizArena — Platform Settings Server Actions
 *
 * RBAC-validated server actions for platform settings management.
 * Handles read/write operations with proper authorization checks.
 *
 * Access:
 *   - ADMIN: operational settings (General, Challenges, Moderation, Auth, Analytics)
 *   - SUPER_ADMIN: all settings including System/protected settings
 */

import { auth } from "@/auth/auth";
import { hasMinimumRole, hasRole } from "@/lib/rbac/hierarchy";
import { ROLES, type Role } from "@/lib/rbac/roles";
import {
  getAllSettingsGrouped,
  getSettingAuditHistory,
  updatePlatformSetting,
  seedDefaultSettings,
} from "@/lib/settings";
import {
  getSettingDefinition,
  isDangerousSetting,
  DEFAULT_SETTINGS,
} from "@/lib/settings/constants";
import type {
  SettingsDashboardData,
  SettingAuditEntry,
  SettingActionResult,
  SettingCategory,
} from "@/lib/settings/types";
import { SETTING_CATEGORIES } from "@/lib/settings/types";
import type { JsonValue } from "@/generated/prisma/runtime/library";

// ─── Auth Helpers ───────────────────────────────────────────

async function validateSettingsAccess(): Promise<{
  userId: string;
  role: Role;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please sign in");
  }

  const userRole = (session.user.role as string) || "USER";

  if (!hasMinimumRole(userRole, ROLES.ADMIN)) {
    throw new Error("Access denied: Admin role required");
  }

  return {
    userId: session.user.id,
    role: userRole as Role,
  };
}

function canModifyProtectedSetting(role: Role): boolean {
  return hasRole(role, ROLES.SUPER_ADMIN);
}

function canAccessCategory(role: Role, category: string): boolean {
  if (hasRole(role, ROLES.SUPER_ADMIN)) return true;

  // ADMIN can access everything except system
  return category !== SETTING_CATEGORIES.SYSTEM;
}

// ─── Read Actions ───────────────────────────────────────────

/**
 * Get all settings data for the dashboard, grouped by category.
 * Filters out System category for non-SUPER_ADMIN users.
 */
export async function getSettingsDashboardData(): Promise<SettingsDashboardData> {
  const { role } = await validateSettingsAccess();

  const allSettings = await getAllSettingsGrouped();
  const recentAudits = await getSettingAuditHistory(undefined, 20);

  // Filter categories based on role
  const filteredSettings: Record<SettingCategory, typeof allSettings.general> = {
    [SETTING_CATEGORIES.GENERAL]: allSettings[SETTING_CATEGORIES.GENERAL] ?? [],
    [SETTING_CATEGORIES.CHALLENGES]: allSettings[SETTING_CATEGORIES.CHALLENGES] ?? [],
    [SETTING_CATEGORIES.MODERATION]: allSettings[SETTING_CATEGORIES.MODERATION] ?? [],
    [SETTING_CATEGORIES.AUTH]: allSettings[SETTING_CATEGORIES.AUTH] ?? [],
    [SETTING_CATEGORIES.ANALYTICS]: allSettings[SETTING_CATEGORIES.ANALYTICS] ?? [],
    [SETTING_CATEGORIES.SYSTEM]: canAccessCategory(role, SETTING_CATEGORIES.SYSTEM)
      ? (allSettings[SETTING_CATEGORIES.SYSTEM] ?? [])
      : [],
  };

  const totalSettings = Object.values(filteredSettings).reduce(
    (sum, settings) => sum + settings.length,
    0
  );

  return {
    settings: filteredSettings,
    totalSettings,
    recentAudits,
  };
}

/**
 * Get audit history for settings changes.
 */
export async function getSettingsAuditHistory(
  settingKey?: string,
  limit: number = 50
): Promise<SettingAuditEntry[]> {
  await validateSettingsAccess();
  return getSettingAuditHistory(settingKey, limit);
}

// ─── Write Actions ──────────────────────────────────────────

/**
 * Update a platform setting.
 * Validates RBAC, checks protection level, and creates audit entry.
 */
export async function updateSettingAction(
  key: string,
  value: JsonValue,
  reason?: string
): Promise<SettingActionResult> {
  try {
    const { userId, role } = await validateSettingsAccess();

    // Check if the setting exists in our definitions
    const definition = getSettingDefinition(key);
    if (!definition) {
      return { success: false, error: "Unknown setting key" };
    }

    // Check category access
    if (!canAccessCategory(role, definition.category)) {
      return {
        success: false,
        error: "Access denied: Insufficient permissions for this setting category",
      };
    }

    // Check protected setting access
    if (definition.isProtected && !canModifyProtectedSetting(role)) {
      return {
        success: false,
        error: "Access denied: This setting requires Super Admin privileges",
      };
    }

    // Validate value type
    const typeValid = validateSettingValueType(value, definition.valueType);
    if (!typeValid) {
      return { success: false, error: `Invalid value type: expected ${definition.valueType}` };
    }

    // Require reason for dangerous settings
    if (isDangerousSetting(key) && !reason?.trim()) {
      return { success: false, error: "A reason is required for modifying this critical setting" };
    }

    await updatePlatformSetting(key, value, userId, reason);

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
}

/**
 * Toggle a boolean feature flag.
 * Convenience wrapper for boolean settings.
 */
export async function toggleFeatureFlagAction(
  key: string,
  reason?: string
): Promise<SettingActionResult> {
  try {
    const { userId, role } = await validateSettingsAccess();

    const definition = getSettingDefinition(key);
    if (!definition) {
      return { success: false, error: "Unknown setting key" };
    }

    if (definition.valueType !== "boolean") {
      return { success: false, error: "This setting is not a boolean toggle" };
    }

    if (!canAccessCategory(role, definition.category)) {
      return {
        success: false,
        error: "Access denied: Insufficient permissions for this setting category",
      };
    }

    if (definition.isProtected && !canModifyProtectedSetting(role)) {
      return {
        success: false,
        error: "Access denied: This setting requires Super Admin privileges",
      };
    }

    // Get current value
    const { prisma } = await import("@/lib/prisma");
    const current = await prisma.platformSetting.findUnique({
      where: { key },
      select: { value: true },
    });

    const currentValue = current?.value === true;
    const newValue = !currentValue;

    // Require reason for dangerous settings
    if (isDangerousSetting(key) && !reason?.trim()) {
      return { success: false, error: "A reason is required for toggling this critical setting" };
    }

    await updatePlatformSetting(key, newValue, userId, reason);

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
}

/**
 * Seed default settings into the database.
 * Only SUPER_ADMIN can seed settings.
 */
export async function seedDefaultSettingsAction(): Promise<
  SettingActionResult & { created?: number }
> {
  try {
    const { role } = await validateSettingsAccess();

    if (!hasRole(role, ROLES.SUPER_ADMIN)) {
      return { success: false, error: "Access denied: Only Super Admin can seed settings" };
    }

    const created = await seedDefaultSettings();

    return { success: true, created };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
}

// ─── Validation Helpers ─────────────────────────────────────

function validateSettingValueType(
  value: JsonValue,
  expectedType: "boolean" | "string" | "number" | "json"
): boolean {
  switch (expectedType) {
    case "boolean":
      return typeof value === "boolean";
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number" && !isNaN(value);
    case "json":
      return value !== undefined;
    default:
      return true;
  }
}

/**
 * Get the count of default settings not yet seeded.
 */
export async function getUnseededSettingsCount(): Promise<number> {
  await validateSettingsAccess();
  const { prisma } = await import("@/lib/prisma");

  const existingKeys = await prisma.platformSetting.findMany({
    select: { key: true },
  });

  const existingKeySet = new Set(existingKeys.map((s) => s.key));
  return DEFAULT_SETTINGS.filter((d) => !existingKeySet.has(d.key)).length;
}
