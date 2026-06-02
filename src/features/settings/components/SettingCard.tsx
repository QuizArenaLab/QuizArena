"use client";

/**
 * QuizArena — Setting Card Component
 *
 * Renders a single platform setting with appropriate
 * input control based on value type.
 */

import { useState } from "react";
import { Lock, Clock, User, Save, RotateCcw } from "lucide-react";
import type { SettingDisplay } from "@/features/settings/services/settings/types";
import { getSettingValueType, isDangerousSetting } from "@/features/settings/services/settings/constants";
import type { JsonValue } from "@/generated/prisma/runtime/library";

interface SettingCardProps {
  setting: SettingDisplay;
  isSuperAdmin: boolean;
  onUpdate: (key: string, value: JsonValue, reason?: string) => Promise<void>;
  onDangerousUpdate: (
    key: string,
    value: JsonValue,
    description: string | null,
    currentValue: string,
    newValue: string
  ) => void;
}

export function SettingCard({
  setting,
  isSuperAdmin,
  onUpdate,
  onDangerousUpdate,
}: SettingCardProps) {
  const valueType = getSettingValueType(setting.key);
  const isDangerous = isDangerousSetting(setting.key);
  const isLocked = setting.isProtected && !isSuperAdmin;

  const [editValue, setEditValue] = useState<string>(
    valueType === "boolean" ? "" : String(setting.value ?? "")
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formatDisplayValue = (value: JsonValue): string => {
    if (typeof value === "boolean") return value ? "Enabled" : "Disabled";
    if (typeof value === "number") return String(value);
    if (typeof value === "string") return value;
    return JSON.stringify(value);
  };

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

  const handleToggle = async () => {
    if (isLocked || isSaving) return;

    const newValue = !(setting.value === true);

    if (isDangerous) {
      onDangerousUpdate(
        setting.key,
        newValue,
        setting.description,
        formatDisplayValue(setting.value),
        formatDisplayValue(newValue)
      );
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(setting.key, newValue);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (isLocked || isSaving) return;

    let parsedValue: JsonValue;
    if (valueType === "number") {
      parsedValue = Number(editValue);
      if (isNaN(parsedValue)) return;
    } else {
      parsedValue = editValue;
    }

    if (isDangerous) {
      onDangerousUpdate(
        setting.key,
        parsedValue,
        setting.description,
        formatDisplayValue(setting.value),
        formatDisplayValue(parsedValue)
      );
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(setting.key, parsedValue);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(String(setting.value ?? ""));
    setIsEditing(false);
  };

  // Extract just the key name from the full key path for display
  const keyLabel = setting.key.split(".").pop() ?? setting.key;
  const keyFormatted = keyLabel.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      className={`group bg-white rounded-xl border transition-all duration-200 ${
        isLocked
          ? "border-gray-100 opacity-75"
          : isDangerous
            ? "border-amber-100 hover:border-amber-200 hover:shadow-sm"
            : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-[#0A1C40]">{keyFormatted}</h4>
              {setting.isProtected && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-semibold uppercase tracking-wider">
                  <Lock className="w-2.5 h-2.5" />
                  Protected
                </span>
              )}
              {isDangerous && !setting.isProtected && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-semibold uppercase tracking-wider">
                  Critical
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {setting.description ?? "No description available"}
            </p>
            <p className="text-[10px] text-gray-400 mt-1.5 font-mono">{setting.key}</p>
          </div>

          {/* Right: Control */}
          <div className="shrink-0">
            {valueType === "boolean" ? (
              <button
                onClick={handleToggle}
                disabled={isLocked || isSaving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#E6701E]/30 focus:ring-offset-1 ${
                  setting.value === true ? "bg-[#E6701E]" : "bg-gray-200"
                } ${isLocked ? "cursor-not-allowed" : "cursor-pointer"} ${isSaving ? "opacity-60" : ""}`}
                title={isLocked ? "Requires Super Admin" : undefined}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    setting.value === true ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            ) : isEditing ? (
              <div className="flex items-center gap-2">
                {valueType === "number" ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-24 px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E6701E]/30 focus:border-[#E6701E]"
                  />
                ) : (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-40 px-2.5 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E6701E]/30 focus:border-[#E6701E]"
                  />
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Save"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Cancel"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!isLocked) {
                    setEditValue(String(setting.value ?? ""));
                    setIsEditing(true);
                  }
                }}
                disabled={isLocked}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                  isLocked
                    ? "border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50"
                    : "border-gray-200 text-[#0A1C40] hover:bg-gray-50 cursor-pointer"
                }`}
              >
                {formatDisplayValue(setting.value)}
              </button>
            )}
          </div>
        </div>

        {/* Footer: Meta info */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
          {setting.updatedBy && (
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <User className="w-3 h-3" />
              <span>{setting.updatedBy.name ?? "Unknown"}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(setting.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
