"use client";

/**
 * QuizArena — Settings Governance Panel
 *
 * Interactive client component for managing platform settings.
 * Handles category tabs, setting cards, confirmation modals,
 * and audit history display.
 */

import { useState, useTransition, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings2,
  Trophy,
  Shield,
  KeyRound,
  BarChart3,
  Server,
  History,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { notify } from "@/shared/components/feedback/notify";
import { SettingCard } from "./SettingCard";
import { ConfirmationModal } from "./ConfirmationModal";
import {
  updatePlatformSetting,
  togglePlatformSetting,
  seedDefaultSettings,
} from "@/features/settings/services/settings";
import {
  SETTING_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  type SettingCategory,
  type SettingDisplay,
  type SettingAuditEntry,
} from "@/features/settings/services/settings/types";
import { getSettingValueType } from "@/features/settings/services/settings/constants";
import type { JsonValue } from "@/generated/prisma/runtime/library";

// ─── Category Icons ─────────────────────────────────────────
const CATEGORY_ICONS: Record<SettingCategory, React.ElementType> = {
  [SETTING_CATEGORIES.GENERAL]: Settings2,
  [SETTING_CATEGORIES.CHALLENGES]: Trophy,
  [SETTING_CATEGORIES.MODERATION]: Shield,
  [SETTING_CATEGORIES.AUTH]: KeyRound,
  [SETTING_CATEGORIES.ANALYTICS]: BarChart3,
  [SETTING_CATEGORIES.SYSTEM]: Server,
};

// ─── Props ──────────────────────────────────────────────────
interface SettingsPanelProps {
  settings: Record<SettingCategory, SettingDisplay[]>;
  recentAudits: SettingAuditEntry[];
  isSuperAdmin: boolean;
  totalSettings: number;
  unseededCount: number;
}

export function SettingsPanel({
  settings: initialSettings,
  recentAudits: initialAudits,
  isSuperAdmin,
  totalSettings,
  unseededCount: initialUnseededCount,
}: SettingsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<SettingCategory | "audit">(
    SETTING_CATEGORIES.GENERAL
  );
  const [settings, setSettings] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [unseededCount, setUnseededCount] = useState(initialUnseededCount);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    key: string;
    value: JsonValue;
    description: string | null;
    currentValue: string;
    newValue: string;
  }>({
    isOpen: false,
    key: "",
    value: null,
    description: null,
    currentValue: "",
    newValue: "",
  });

  // Get visible categories (filter empty + system for non-superadmin)
  const visibleCategories = Object.values(SETTING_CATEGORIES).filter((cat) => {
    if (cat === SETTING_CATEGORIES.SYSTEM && !isSuperAdmin) return false;
    return (settings[cat]?.length ?? 0) > 0;
  });

  const [pendingToast, setPendingToast] = useState<{
    id: string;
    title: string;
    desc?: string;
    reload?: boolean;
  } | null>(null);

  useEffect(() => {
    if (!isPending && pendingToast) {
      notify.success(pendingToast.title, {
        id: pendingToast.id,
        description: pendingToast.desc,
      });
      if (pendingToast.reload) {
        window.location.reload();
      }
      setTimeout(() => setPendingToast(null), 0);
    }
  }, [isPending, pendingToast]);

  // ─── Handlers ─────────────────────────────────────────────

  const handleUpdate = useCallback(async (key: string, value: JsonValue, reason?: string) => {
    const toastId = notify.loading("Updating Setting...");
    startTransition(async () => {
      const valueType = getSettingValueType(key);

      let result;
      if (valueType === "boolean" && reason === undefined) {
        result = await togglePlatformSetting(key);
      } else {
        result = await updatePlatformSetting(key, value, reason);
      }

      if (result.success) {
        // Optimistic update
        setSettings((prev) => {
          const updated = { ...prev };
          for (const cat of Object.values(SETTING_CATEGORIES)) {
            updated[cat] = prev[cat].map((s) =>
              s.key === key ? { ...s, value, updatedAt: new Date() } : s
            );
          }
          return updated;
        });
        setPendingToast({
          id: toastId,
          title: "Setting Updated",
          desc: "The platform configuration has been saved.",
        });
      } else {
        notify.error(result.error ?? "Failed to update setting", { id: toastId });
      }
    });
  }, []);

  const handleDangerousUpdate = useCallback(
    (
      key: string,
      value: JsonValue,
      description: string | null,
      currentValue: string,
      newValue: string
    ) => {
      setConfirmModal({
        isOpen: true,
        key,
        value,
        description,
        currentValue,
        newValue,
      });
    },
    []
  );

  const handleConfirm = useCallback(
    async (reason: string) => {
      await handleUpdate(confirmModal.key, confirmModal.value, reason);
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    },
    [confirmModal.key, confirmModal.value, handleUpdate]
  );

  const handleSeed = useCallback(async () => {
    const toastId = notify.loading("Seeding Settings...");
    startTransition(async () => {
      const result = await seedDefaultSettings();
      if (result.success) {
        setUnseededCount(0);
        setPendingToast({
          id: toastId,
          title: "Settings Initialized",
          desc: `${result.created ?? 0} default settings have been seeded.`,
          reload: true,
        });
      } else {
        notify.error(result.error ?? "Failed to seed settings", { id: toastId });
      }
    });
  }, []);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatValue = (value: JsonValue | null | undefined): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Enabled" : "Disabled";
    if (typeof value === "number") return String(value);
    if (typeof value === "string") return value.length > 40 ? value.slice(0, 40) + "…" : value;
    return JSON.stringify(value);
  };

  // ─── Render ───────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Seed Banner */}
      {isSuperAdmin && unseededCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-[#D5DBFD]/30 rounded-xl border border-[#D5DBFD]/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2471E7]/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#2471E7]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0A1C40]">
                {unseededCount} default settings not yet initialized
              </p>
              <p className="text-xs text-gray-500">
                Seed default settings to initialize platform configuration
              </p>
            </div>
          </div>
          <button
            onClick={handleSeed}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2471E7] hover:bg-[#1d5ec4] rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            Seed Defaults
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {visibleCategories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat];
          const isActive = activeCategory === cat;
          const count = settings[cat]?.length ?? 0;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "bg-[#0A1C40] text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#0A1C40]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{CATEGORY_LABELS[cat]}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        {/* Audit Tab */}
        <button
          onClick={() => setActiveCategory("audit")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            activeCategory === "audit"
              ? "bg-[#0A1C40] text-white shadow-sm"
              : "text-gray-500 hover:bg-gray-50 hover:text-[#0A1C40]"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Log</span>
        </button>
      </div>

      {/* Content */}
      {activeCategory !== "audit" ? (
        <div className="space-y-4">
          {/* Category Header */}
          <div className="flex items-center gap-3 pb-2">
            {(() => {
              const Icon = CATEGORY_ICONS[activeCategory];
              return (
                <>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0A1C40]">
                      {CATEGORY_LABELS[activeCategory]}
                    </h3>
                    <p className="text-xs text-gray-500">{CATEGORY_DESCRIPTIONS[activeCategory]}</p>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {(settings[activeCategory] ?? []).map((setting) => (
              <SettingCard
                key={setting.id}
                setting={setting}
                isSuperAdmin={isSuperAdmin}
                onUpdate={handleUpdate}
                onDangerousUpdate={handleDangerousUpdate}
              />
            ))}
          </div>

          {(settings[activeCategory] ?? []).length === 0 && (
            <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <Settings2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">No settings in this category</p>
              <p className="text-xs text-gray-400 mt-1">
                Settings will appear here once initialized
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Audit Log */
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-2">
            <div className="p-2 bg-gray-50 rounded-lg">
              <History className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0A1C40]">Configuration Audit Log</h3>
              <p className="text-xs text-gray-500">
                Track all platform settings changes with accountability
              </p>
            </div>
          </div>

          {initialAudits.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
              {initialAudits.map((audit) => (
                <div key={audit.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#0A1C40] font-mono">
                          {audit.settingKey}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        {audit.previousValue !== null && (
                          <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-md font-medium">
                            {formatValue(audit.previousValue)}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">→</span>
                        <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-md font-medium">
                          {formatValue(audit.newValue)}
                        </span>
                      </div>
                      {audit.reason && (
                        <p className="text-xs text-gray-500 mt-2 italic">
                          &ldquo;{audit.reason}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-gray-600">
                        {audit.changedBy.name ?? "Unknown"}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {formatTimeAgo(audit.changedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">No audit entries yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Changes to settings will be recorded here
              </p>
            </div>
          )}
        </div>
      )}

      {/* Summary Footer */}
      <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100">
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-[#0A1C40]">{totalSettings}</span> total settings •{" "}
          <span className="font-semibold text-[#0A1C40]">{visibleCategories.length}</span>{" "}
          categories
        </p>
        {activeCategory !== "audit" && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <AlertTriangle className="w-3 h-3" />
            <span>Critical changes require confirmation</span>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirm}
        settingKey={confirmModal.key}
        settingDescription={confirmModal.description}
        currentValue={confirmModal.currentValue}
        newValue={confirmModal.newValue}
        isLoading={isPending}
      />
    </div>
  );
}
