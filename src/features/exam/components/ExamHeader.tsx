"use client";

/**
 * QuizArena — Exam Header Component
 *
 * Sticky header with:
 * - QuizArena branding
 * - Challenge title
 * - Timer (always visible)
 * - Progress indicator
 * - Submit button (always accessible)
 * - Mobile palette toggle
 */

import { cn } from "@/lib/utils";
import { ExamTimer } from "./ExamTimer";
import { Send, Grid3X3, Loader2, WifiOff } from "lucide-react";
import type { TimerUrgency, SaveStatus } from "@/types/exam";

interface ExamHeaderProps {
  challengeTitle: string;
  timerFormatted: string;
  timerUrgency: TimerUrgency;
  answeredCount: number;
  totalQuestions: number;
  isSubmitting: boolean;
  onSubmitRequest: () => void;
  onToggleMobilePalette: () => void;
  saveStatus: SaveStatus;
  isOffline: boolean;
}

export function ExamHeader({
  challengeTitle,
  timerFormatted,
  timerUrgency,
  answeredCount,
  totalQuestions,
  isSubmitting,
  onSubmitRequest,
  onToggleMobilePalette,
  saveStatus,
  isOffline,
}: ExamHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-amber-500/90 text-white text-center py-1.5 px-4 text-xs font-medium flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          Connection lost — answers will sync when restored
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Branding + Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              QA
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-semibold text-white truncate">
                {challengeTitle}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>
                  {answeredCount}/{totalQuestions} answered
                </span>
                {saveStatus === "saving" && (
                  <span className="text-blue-400 flex items-center gap-1">
                    <Loader2 size={10} className="animate-spin" />
                    Saving
                  </span>
                )}
                {saveStatus === "saved" && <span className="text-emerald-400">✓ Saved</span>}
                {saveStatus === "error" && <span className="text-red-400">Save failed</span>}
              </div>
            </div>
          </div>

          {/* Right: Timer + Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Timer */}
            <ExamTimer
              formatted={timerFormatted}
              urgency={timerUrgency}
              className="text-sm sm:text-base"
            />

            {/* Mobile Palette Toggle */}
            <button
              onClick={onToggleMobilePalette}
              className="lg:hidden p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
              aria-label="Open question palette"
            >
              <Grid3X3 size={18} />
            </button>

            {/* Submit Button */}
            <button
              onClick={onSubmitRequest}
              disabled={isSubmitting}
              className={cn(
                "hidden sm:flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200",
                isSubmitting
                  ? "bg-blue-600/50 text-blue-200 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.97]"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="hidden sm:inline">Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span className="hidden sm:inline">Submit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2.5">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
