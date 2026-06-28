import { Competition } from "@/generated/prisma";
import { Badge } from "lucide-react"; // Assuming we use custom badges, or we can just use tailwind
import { Timer, CheckCircle2, ShieldAlert, Trophy, CirclePlay } from "lucide-react";
import { DynamicCTA } from "./DynamicCTA";
import { EligibilityDetail } from "@/features/competitions/experience/actions/landing.actions";
import { SessionState } from "@/generated/prisma";

interface LandingHeroProps {
  competition: Competition;
  isEligible: boolean;
  eligibilityDetails: EligibilityDetail[];
  sessionState: SessionState | null;
}

export function LandingHero({ competition, isEligible, eligibilityDetails, sessionState }: LandingHeroProps) {
  return (
    <section className="bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
        
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest rounded-full">
              {competition.competitionType.replace("_", " ")}
            </span>
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full ${competition.status === 'LIVE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
              {competition.status}
            </span>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full">
              {competition.difficulty}
            </span>
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              {competition.title}
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              {competition.description || "Take on this challenge and prove your skills."}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-slate-300">
              <Timer className="w-5 h-5 text-slate-500" />
              <span className="font-semibold">{competition.durationMinutes} mins</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-slate-500" />
              <span className="font-semibold">{competition.totalQuestions} Questions</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="font-semibold">Rewards Available</span>
            </div>
          </div>
        </div>

        {/* Right CTA Panel */}
        <div className="w-full md:w-auto flex flex-col items-stretch gap-4 p-6 bg-slate-950/50 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
          <DynamicCTA 
            competition={competition}
            isEligible={isEligible}
            eligibilityDetails={eligibilityDetails}
            sessionState={sessionState}
          />
          <p className="text-xs text-center text-slate-500">
            {isEligible ? "Ready to begin!" : "Check eligibility requirements below."}
          </p>
        </div>

      </div>
    </section>
  );
}
