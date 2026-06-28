import { useState } from "react";
import {
  useRuntimeState,
  useRuntimeCommand,
  useMobilePaletteStore,
} from "../../../runtime/providers/CompetitionRuntimeProvider";
import { Loader2, Menu, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";

export function WorkspaceHeader() {
  const competitionTitle = useRuntimeState((s: any) => s.competitionTitle);
  const remainingSeconds = useRuntimeState((s: any) => s.remainingSeconds);
  const status = useRuntimeState((s: any) => s.status);
  const connectionStatus = useRuntimeState((s: any) => s.connectionStatus);
  const mutationQueueSize = useRuntimeState((s: any) => s.mutationQueueSize);

  const { dispatch } = useRuntimeCommand();
  const { setShowMobilePalette } = useMobilePaletteStore();

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const isSaving = connectionStatus === "Saving" || mutationQueueSize > 0;
  const isOffline = connectionStatus === "Offline";
  const isSubmitting = status === "SUBMITTING";

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const timeString = formatTime(remainingSeconds);
  const isWarning = remainingSeconds > 0 && remainingSeconds <= 300; // less than 5 mins

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-sm h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setShowMobilePalette(true)}
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          href="/dashboard"
          className="hidden sm:block text-xl font-black text-white hover:text-slate-300 transition-colors"
        >
          QuizArena
        </Link>
        <div className="hidden sm:block w-px h-6 bg-slate-700" />
        <h1 className="text-sm font-semibold text-slate-300 truncate max-w-[150px] sm:max-w-xs md:max-w-md">
          {competitionTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {/* Network & Save Status */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
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

        {/* Timer */}
        <div
          className={`font-mono text-lg sm:text-xl font-bold tracking-wider ${
            isWarning ? "text-red-500 animate-pulse" : "text-white"
          }`}
        >
          {timeString}
        </div>

        {/* Submit Button */}
        <button
          disabled={isSubmitting || status === "SUBMITTED"}
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-1.5 sm:px-6 sm:py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-lg transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">Submit Assessment?</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to submit your answers? You cannot change them after submission.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  dispatch("SubmitCompetition");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
