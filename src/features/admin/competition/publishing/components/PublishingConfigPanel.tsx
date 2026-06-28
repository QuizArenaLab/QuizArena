"use client";

import { usePublishingStore } from "../hooks/usePublishingStore";
import { CompetitionWithRelations } from "../../types";
import { ReadinessScore } from "../validation/types/validation.types";
import { Calendar, Save, Send, Archive, RefreshCcw } from "lucide-react";
import { format } from "date-fns";

interface PublishingConfigPanelProps {
  competition: CompetitionWithRelations;
  readinessScore: ReadinessScore;
  onSaveDraft: () => void;
  onMarkReady: () => void;
  onPublish: (mode: "IMMEDIATE" | "SCHEDULED") => void;
}

export function PublishingConfigPanel({
  competition,
  readinessScore,
  onSaveDraft,
  onMarkReady,
  onPublish,
}: PublishingConfigPanelProps) {
  const config = usePublishingStore((s) => s.config);
  const setConfig = usePublishingStore((s) => s.setConfig);
  const isSubmitting = usePublishingStore((s) => s.isSubmitting);
  const lock = usePublishingStore((s) => s.publishingLock);

  const isLocked = lock !== null;
  const canPublish =
    !isLocked && readinessScore.level !== "BLOCKED" && readinessScore.level !== "NEEDS_ATTENTION";

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-bold text-navy">Publishing Actions</h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Release Strategy</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setConfig({ mode: "IMMEDIATE" })}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                config.mode === "IMMEDIATE"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Publish Now
            </button>
            <button
              onClick={() => setConfig({ mode: "SCHEDULED" })}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                config.mode === "SCHEDULED"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-4 h-4" /> Schedule
            </button>
          </div>
        </div>

        {/* Scheduling Inputs */}
        {config.mode === "SCHEDULED" && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                className="w-full text-sm border-gray-300 rounded focus:ring-primary focus:border-primary"
                value={config.scheduledDate || ""}
                onChange={(e) => setConfig({ scheduledDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Timezone</label>
              <select
                className="w-full text-sm border-gray-300 rounded focus:ring-primary focus:border-primary"
                value={config.timezone}
                onChange={(e) => setConfig({ timezone: e.target.value })}
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 space-y-2 border-t border-gray-100">
          {competition.status === "DRAFT" && (
            <button
              onClick={onMarkReady}
              disabled={isSubmitting || readinessScore.level === "BLOCKED"}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Mark as Ready
            </button>
          )}

          {(competition.status === "READY" || competition.status === "SCHEDULED") && (
            <button
              onClick={() => onPublish(config.mode)}
              disabled={isSubmitting || !canPublish}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {config.mode === "IMMEDIATE" ? "Publish Live" : "Schedule Publication"}
            </button>
          )}

          <button
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
}
