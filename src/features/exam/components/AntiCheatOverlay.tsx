"use client";

/**
 * QuizArena — Anti-Cheat Overlay
 *
 * Warning toasts, flagged banner, and violation indicators.
 */

import { cn } from "@/lib/utils";
import { ShieldAlert, X, AlertTriangle } from "lucide-react";
import type { WarningLevel } from "@/types/exam";

interface AntiCheatOverlayProps {
  showWarning: boolean;
  warningMessage: string;
  onDismissWarning: () => void;
  isFlagged: boolean;
  violationCount: number;
  warningLevel: WarningLevel;
}

export function AntiCheatOverlay({
  showWarning,
  warningMessage,
  onDismissWarning,
  isFlagged,
  violationCount,
  warningLevel,
}: AntiCheatOverlayProps) {
  return (
    <>
      {/* Warning Toast */}
      {showWarning && (
        <div className="fixed top-20 right-4 z-50 exam-toast-slide max-w-sm">
          <div
            className={cn(
              "flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl border",
              warningLevel === "critical"
                ? "bg-red-950/90 border-red-500/30 text-red-200"
                : "bg-amber-950/90 border-amber-500/30 text-amber-200"
            )}
          >
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1">{warningMessage}</p>
            <button
              onClick={onDismissWarning}
              className="shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Dismiss warning"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Flagged Banner */}
      {isFlagged && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-2.5 flex items-center justify-center gap-2 text-red-400 text-sm font-medium">
          <AlertTriangle size={16} />
          Your attempt has been flagged for review due to multiple violations.
        </div>
      )}

      {/* Violation Count Badge (subtle, non-intrusive) */}
      {violationCount > 0 && !isFlagged && (
        <div className="bg-amber-500/5 border-b border-amber-500/10 px-6 py-1.5 flex items-center justify-center gap-2 text-amber-500/80 text-xs font-medium">
          <ShieldAlert size={12} />
          {violationCount} violation{violationCount !== 1 ? "s" : ""} detected
        </div>
      )}
    </>
  );
}
