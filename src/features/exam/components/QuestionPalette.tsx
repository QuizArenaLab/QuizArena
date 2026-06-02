"use client";

/**
 * QuizArena — Question Palette Component
 *
 * Sidebar palette showing all questions with 4 visual states:
 * CURRENT, ANSWERED, UNANSWERED, NOT_VISITED.
 * Desktop: sticky sidebar. Mobile: used inside MobilePaletteDrawer.
 */

import { cn } from "@/lib/utils";
import type { PaletteState } from "@/types/exam";

interface QuestionPaletteProps {
  totalQuestions: number;
  getPaletteState: (index: number) => PaletteState;
  onSelectQuestion: (index: number) => void;
  answeredCount: number;
  unansweredCount: number;
  notVisitedCount: number;
  className?: string;
  compact?: boolean;
}

const PALETTE_STYLES: Record<PaletteState, string> = {
  CURRENT:
    "bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 font-bold",
  ANSWERED:
    "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30",
  UNANSWERED: "bg-amber-500/15 text-amber-400 border border-amber-500/40 hover:bg-amber-500/25",
  NOT_VISITED:
    "bg-slate-800/60 text-slate-500 border border-slate-700 hover:bg-slate-700/80 hover:text-slate-400",
};

export function QuestionPalette({
  totalQuestions,
  getPaletteState,
  onSelectQuestion,
  answeredCount,
  unansweredCount,
  notVisitedCount,
  className,
  compact = false,
}: QuestionPaletteProps) {
  return (
    <div
      className={cn(
        "bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Question Palette
        </h3>
      </div>

      {/* Grid */}
      <div className="p-4">
        <div className={cn("grid gap-2", compact ? "grid-cols-8" : "grid-cols-5")}>
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const state = getPaletteState(index);
            return (
              <button
                key={index}
                onClick={() => onSelectQuestion(index)}
                className={cn(
                  "h-10 w-full rounded-lg font-medium text-sm transition-all duration-150 flex items-center justify-center",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  PALETTE_STYLES[state]
                )}
                aria-label={`Question ${index + 1} — ${state.toLowerCase().replace("_", " ")}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-4 border-t border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-md bg-blue-600" />
          <span className="text-xs text-slate-400">Current</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-md bg-emerald-500/25 border border-emerald-500/40" />
          <span className="text-xs text-slate-400">Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-md bg-amber-500/20 border border-amber-500/40" />
          <span className="text-xs text-slate-400">
            Unanswered (
            {unansweredCount - notVisitedCount > 0 ? unansweredCount - notVisitedCount : 0})
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 rounded-md bg-slate-800 border border-slate-700" />
          <span className="text-xs text-slate-400">Not Visited ({notVisitedCount})</span>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/40">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Progress</span>
          <span className="font-medium text-slate-300">
            {answeredCount}/{totalQuestions} answered
          </span>
        </div>
        <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{
              width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
