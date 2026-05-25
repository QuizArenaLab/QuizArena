"use client";

import { useState } from "react";
import type { FeatureFlagPayload } from "@/types/super-admin-rollouts";
import { AlertTriangle, Power, X } from "lucide-react";

// Since we cannot run server actions directly from here without importing one,
// we will assume we build a server action wrapper later. For now, we mock the UI interaction.

interface RollbackGovernancePanelProps {
  flag: FeatureFlagPayload;
  onClose: () => void;
}

export function RollbackGovernancePanel({ flag, onClose }: RollbackGovernancePanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState("");

  const isHighRisk =
    flag.key.includes("auth") || flag.key.includes("security") || flag.key.includes("infra");

  const handleRollback = async () => {
    if (!reason.trim()) return;
    setIsSubmitting(true);
    // In a real app, invoke server action `rollbackFeature` here.
    // await executeRollback(flag.key, reason);
    // router.refresh();
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/50">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Power className="w-5 h-5 text-red-500" />
              Emergency Rollback
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Instantly disable <span className="font-mono text-slate-400">{flag.key}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-300 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isHighRisk && (
            <div className="flex items-start gap-3 p-4 bg-orange-950/20 border border-orange-900/40 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-orange-400 mb-1">
                  High-Risk Infrastructure Warning
                </h4>
                <p className="text-xs text-orange-300/80 leading-relaxed">
                  You are about to rollback a critical platform feature. This action will
                  immediately terminate the rollout across all environments. All users will revert
                  to the fallback implementation.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="reason"
              className="block text-xs font-bold text-slate-400 uppercase tracking-wider"
            >
              Rollback Reason (Required)
            </label>
            <textarea
              id="reason"
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all resize-none"
              placeholder="e.g. Critical authorization bug identified in production..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <p className="text-[10px] text-slate-500">
              This reason will be permanently recorded in the sovereign audit log.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRollback}
            disabled={!reason.trim() || isSubmitting}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              !reason.trim() || isSubmitting
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            }`}
          >
            {isSubmitting ? "Executing Rollback..." : "Execute Rollback"}
          </button>
        </div>
      </div>
    </div>
  );
}
