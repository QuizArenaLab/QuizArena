"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, PlayCircle, Loader2, Lock, ArrowRight } from "lucide-react";
import { Competition, SessionState } from "@/generated/prisma";
import { EligibilityDetail, prepareCompetitionSession } from "@/features/competitions/experience/actions/landing.actions";
import { cn } from "@/lib/utils";

interface DynamicCTAProps {
  competition: Competition;
  isEligible: boolean;
  eligibilityDetails: EligibilityDetail[];
  sessionState: SessionState | null;
}

export function DynamicCTA({ competition, isEligible, eligibilityDetails, sessionState }: DynamicCTAProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await prepareCompetitionSession(competition.slug);
      if (result.success) {
        // We do not pass sessionId in the URL for security/cleanliness usually, 
        // the workspace will fetch the active session. Or we could pass it. 
        // For now, redirect to workspace.
        router.push(`/dashboard/competitions/${competition.slug}/workspace`);
      } else {
        setError(result.error || "Failed to start competition.");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  // State Machine Logic
  if (competition.status === "SCHEDULED") {
    return (
      <button disabled className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 text-slate-400 font-bold rounded-xl cursor-not-allowed w-full">
        <span>Starts Soon</span>
      </button>
    );
  }

  if (competition.status === "COMPLETED" || competition.status === "EXPIRED") {
    return (
      <button disabled className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 text-slate-400 font-bold rounded-xl cursor-not-allowed w-full">
        <span>Competition Closed</span>
      </button>
    );
  }

  if (!isEligible) {
    const isAttemptsExhausted = eligibilityDetails.some(d => d.requirement === "Attempts Remaining" && d.status === "NOT_ELIGIBLE");
    if (isAttemptsExhausted) {
      return (
        <button disabled className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 text-slate-400 font-bold rounded-xl cursor-not-allowed w-full">
          <span>Attempts Exhausted</span>
        </button>
      );
    }
    return (
      <button disabled className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800/50 text-slate-500 font-bold rounded-xl cursor-not-allowed w-full">
        <Lock className="w-5 h-5" />
        <span>Ineligible</span>
      </button>
    );
  }

  const isResuming = sessionState === "IN_PROGRESS" || sessionState === "PAUSED";
  const buttonLabel = isResuming ? "Resume Competition" : "Start Competition";

  return (
    <div className="w-full flex flex-col gap-2">
      <button
        onClick={handleStart}
        disabled={loading}
        className={cn(
          "group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-bold rounded-xl transition-all shadow-xl w-full",
          isResuming ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20" : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20",
          loading && "opacity-80 pointer-events-none"
        )}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <span>{buttonLabel}</span>
            {isResuming ? <ArrowRight className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          </>
        )}
      </button>
      {error && (
        <p className="text-red-400 text-xs text-center">{error}</p>
      )}
    </div>
  );
}
