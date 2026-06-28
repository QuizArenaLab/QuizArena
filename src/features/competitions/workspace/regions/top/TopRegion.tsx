"use client";

import { useRuntimeState } from "@/features/competitions/runtime/providers/CompetitionRuntimeProvider";
import { WorkspaceConfiguration } from "../../types/workspace.types";
import { Loader2, Wifi, WifiOff } from "lucide-react";

interface TopRegionProps {
  config: WorkspaceConfiguration;
}

export function TopRegion({ config }: TopRegionProps) {
  const competitionTitle = useRuntimeState((s: any) => s.competitionTitle);
  const remainingSeconds = useRuntimeState((s: any) => s.remainingSeconds);
  const connectionStatus = useRuntimeState((s: any) => s.connectionStatus);
  const mutationQueueSize = useRuntimeState((s: any) => s.mutationQueueSize);
  
  // Progress computation strictly from state
  const questions = useRuntimeState((s: any) => s.questions);
  const answers = useRuntimeState((s: any) => s.answers);
  const total = questions.length;
  const answered = Object.keys(answers).length;
  const progressPercent = total > 0 ? (answered / total) * 100 : 0;

  const isSaving = connectionStatus === "Saving" || mutationQueueSize > 0;
  const isOffline = connectionStatus === "Offline";

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isWarning = remainingSeconds <= config.timerThresholds.warningSeconds && remainingSeconds > config.timerThresholds.criticalSeconds;
  const isCritical = remainingSeconds <= config.timerThresholds.criticalSeconds && remainingSeconds > 0;

  return (
    <header className="flex flex-col bg-slate-900 border-b border-slate-800 z-40 sticky top-0">
      <div className="h-16 flex items-center justify-between px-6">
        {/* Left: Branding & Title */}
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-white">QuizArena</span>
          <div className="w-px h-6 bg-slate-700 hidden sm:block" />
          <h1 className="text-sm font-semibold text-slate-300 truncate max-w-[200px] md:max-w-md hidden sm:block">
            {competitionTitle}
          </h1>
        </div>

        {/* Right: Network, Timer, Submit */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-medium">
            {isOffline ? (
              <span className="flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-1 rounded-md">
                <WifiOff className="w-3.5 h-3.5" />
                Offline
              </span>
            ) : isSaving ? (
              <span className="flex items-center gap-1 text-amber-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400">
                <Wifi className="w-3.5 h-3.5" />
                Saved
              </span>
            )}
          </div>

          {config.showTimer && (
            <div
              className={`font-mono text-xl font-bold tracking-wider ${
                isCritical ? "text-red-500 animate-pulse" : isWarning ? "text-amber-500" : "text-white"
              }`}
            >
              {formatTime(remainingSeconds)}
            </div>
          )}
        </div>
      </div>
      
      {/* Progress Bar (If configured) */}
      {config.showProgress && (
        <div className="h-1 bg-slate-800 w-full">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
      )}
    </header>
  );
}
