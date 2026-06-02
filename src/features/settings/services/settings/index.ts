/**
 * QuizArena — Centralized Platform Settings Utilities
 *
 * Server-side configuration access layer.
 * All platform configuration reads and writes go through this module.
 *
 * DO NOT import this from client components — it uses Prisma directly.
 */

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import type { JsonValue } from "@/generated/prisma/runtime/library";
import type { SettingDisplay, SettingAuditEntry, SettingCategory } from "./types";
import { SETTING_CATEGORIES } from "./types";
import { DEFAULT_SETTINGS } from "./constants";

// ─── Read Operations ────────────────────────────────────────

/**
 * Get a single platform setting value by key.
 * Returns null if the setting does not exist.
 */
export async function getPlatformSetting(key: string): Promise<JsonValue | null> {
  const setting = await prisma.platformSetting.findUnique({
    where: { key },
    select: { value: true },
  });
  return setting?.value ?? null;
}

/**
 * Get a typed platform setting with a fallback default value.
 * Uses the default from constants if no DB entry exists.
 */
export async function getPlatformSettingTyped<T extends JsonValue>(
  key: string,
  defaultValue: T
): Promise<T> {
  const value = await getPlatformSetting(key);
  if (value === null) return defaultValue;
  return value as T;
}

/**
 * Check if a feature flag is enabled.
 * Returns the boolean value of the setting, or false if not found.
 */
export async function featureEnabled(key: string): Promise<boolean> {
  const value = await getPlatformSetting(key);
  if (value === null) {
    // Fall back to default from constants
    const definition = DEFAULT_SETTINGS.find((s) => s.key === key);
    if (definition && typeof definition.defaultValue === "boolean") {
      return definition.defaultValue;
    }
    return false;
  }
  return value === true;
}

/**
 * Get all feature flag states as a map.
 */
export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  const booleanSettings = DEFAULT_SETTINGS.filter((s) => s.valueType === "boolean");
  const keys = booleanSettings.map((s) => s.key);

  const settings = await prisma.platformSetting.findMany({
    where: { key: { in: keys } },
    select: { key: true, value: true },
  });

  const flags: Record<string, boolean> = {};

  for (const def of booleanSettings) {
    const dbSetting = settings.find((s) => s.key === def.key);
    flags[def.key] = dbSetting ? dbSetting.value === true : (def.defaultValue as boolean);
  }

  return flags;
}

/**
 * Get all settings for a specific category.
 */
export async function getSettingsByCategory(category: SettingCategory): Promise<SettingDisplay[]> {
  const settings = await prisma.platformSetting.findMany({
    where: { category },
    include: {
      updatedBy: {
        select: { id: true, name: true },
      },
    },
    orderBy: { key: "asc" },
  });

  return settings.map((s) => ({
    id: s.id,
    key: s.key,
    value: s.value,
    category: s.category,
    description: s.description,
    isProtected: s.isProtected,
    updatedAt: s.updatedAt,
    updatedBy: s.updatedBy,
  }));
}

/**
 * Get all settings grouped by category.
 */
export async function getAllSettingsGrouped(): Promise<Record<SettingCategory, SettingDisplay[]>> {
  const allSettings = await prisma.platformSetting.findMany({
    include: {
      updatedBy: {
        select: { id: true, name: true },
      },
    },
    orderBy: { key: "asc" },
  });

  const grouped: Record<SettingCategory, SettingDisplay[]> = {
    [SETTING_CATEGORIES.GENERAL]: [],
    [SETTING_CATEGORIES.CHALLENGES]: [],
    [SETTING_CATEGORIES.MODERATION]: [],
    [SETTING_CATEGORIES.AUTH]: [],
    [SETTING_CATEGORIES.ANALYTICS]: [],
    [SETTING_CATEGORIES.SYSTEM]: [],
  };

  for (const s of allSettings) {
    const category = s.category as SettingCategory;
    if (grouped[category]) {
      grouped[category].push({
        id: s.id,
        key: s.key,
        value: s.value,
        category: s.category,
        description: s.description,
        isProtected: s.isProtected,
        updatedAt: s.updatedAt,
        updatedBy: s.updatedBy,
      });
    }
  }

  return grouped;
}

// ─── Write Operations ───────────────────────────────────────

/**
 * Update a platform setting with audit logging.
 * The caller is responsible for RBAC validation before calling this.
 */
export async function updatePlatformSetting(
  key: string,
  value: JsonValue,
  userId: string,
  reason?: string
): Promise<void> {
  // Get current value for audit trail
  const current = await prisma.platformSetting.findUnique({
    where: { key },
    select: { value: true },
  });

  const definition = DEFAULT_SETTINGS.find((s) => s.key === key);
  const inputValue = value as Prisma.InputJsonValue;
  const previousValue =
    current?.value !== undefined && current?.value !== null
      ? (current.value as Prisma.InputJsonValue)
      : Prisma.DbNull;

  await prisma.$transaction([
    prisma.platformSetting.upsert({
      where: { key },
      update: {
        value: inputValue,
        updatedById: userId,
      },
      create: {
        key,
        value: inputValue,
        category: definition?.category ?? "general",
        description: definition?.description ?? null,
        isProtected: definition?.isProtected ?? false,
        updatedById: userId,
      },
    }),
    prisma.settingAudit.create({
      data: {
        settingKey: key,
        previousValue: previousValue,
        newValue: inputValue,
        reason: reason ?? null,
        changedById: userId,
      },
    }),
  ]);
}

// ─── Audit Operations ───────────────────────────────────────

/**
 * Get recent audit entries for settings changes.
 */
export async function getSettingAuditHistory(
  settingKey?: string,
  limit: number = 50
): Promise<SettingAuditEntry[]> {
  const where = settingKey ? { settingKey } : {};

  const audits = await prisma.settingAudit.findMany({
    where,
    include: {
      changedBy: {
        select: { id: true, name: true },
      },
    },
    orderBy: { changedAt: "desc" },
    take: limit,
  });

  return audits.map((a) => ({
    id: a.id,
    settingKey: a.settingKey,
    previousValue: a.previousValue,
    newValue: a.newValue,
    reason: a.reason,
    changedBy: a.changedBy,
    changedAt: a.changedAt,
  }));
}

// ─── Seed Operations ────────────────────────────────────────

/**
 * Seed default settings into the database.
 * Only creates settings that don't already exist (upsert by key).
 */
export async function seedDefaultSettings(): Promise<number> {
  let created = 0;

  for (const def of DEFAULT_SETTINGS) {
    const existing = await prisma.platformSetting.findUnique({
      where: { key: def.key },
    });

    if (!existing) {
      await prisma.platformSetting.create({
        data: {
          key: def.key,
          value: def.defaultValue as Prisma.InputJsonValue,
          category: def.category,
          description: def.description,
          isProtected: def.isProtected,
        },
      });
      created++;
    }
  }

  return created;
}
