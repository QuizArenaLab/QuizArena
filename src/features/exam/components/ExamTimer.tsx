"use client";

/**
 * QuizArena — Exam Timer Component
 *
 * Always-visible countdown timer with urgency states.
 * Reads expiration from Zustand store.
 */

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import type { TimerUrgency } from "@/types/exam";

interface ExamTimerProps {
  formatted: string;
  urgency: TimerUrgency;
  className?: string;
}

export function ExamTimer({ formatted, urgency, className }: ExamTimerProps) {
  return (
    <div
      className={cn(
        "exam-timer flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-base font-bold transition-all duration-300",
        urgency === "danger" &&
          "bg-red-500/15 text-red-500 border border-red-500/30 exam-timer-danger",
        urgency === "warning" &&
          "bg-amber-500/15 text-amber-500 border border-amber-500/30 exam-timer-warning",
        urgency === "normal" && "bg-slate-800/80 text-emerald-400 border border-slate-700",
        className
      )}
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining: ${formatted}`}
    >
      <Clock size={18} className={cn("shrink-0", urgency === "danger" && "animate-pulse")} />
      <span className="tabular-nums tracking-wider">{formatted}</span>
    </div>
  );
}
