"use client";

import { Trophy, Target, Clock, ArrowRight, Shield, Award, Activity, CalendarDays, Flame } from "lucide-react";
import { useState } from "react";
import { ChallengePreviewModal } from "./ChallengePreviewModal";

interface FeaturedEventProps {
  stats?: {
    live: number;
    upcoming: number;
    rank: number | null;
    streak: number;
  };
}

export function FeaturedEvent({ stats }: FeaturedEventProps) {
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);

  // Mocked featured event data
  const featuredChallenge = {
    id: "featured-1",
    title: "SSC National Sprint #12",
    slug: "ssc-national-sprint-12",
    totalQuestions: 20,
    durationInMinutes: 20,
    difficulty: "Advanced",
    category: "SSC",
    participantsCount: 1482,
    isFeatured: true,
  };

  return (
    <>
      <section className="relative rounded-[24px] overflow-hidden bg-[#151828] text-white shadow-2xl flex flex-col justify-between border border-gray-800">
        
        {/* Decorative Backgrounds */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-size-[24px_24px] opacity-10"></div>
          <div
            className="absolute top-[-40%] right-[-10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"
          />
        </div>

        <div className="relative z-10 w-full p-8 md:px-10 md:pt-10 md:pb-8 flex flex-col md:flex-row items-start justify-between gap-8">
          
          <div className="flex-1 w-full space-y-6">
            {/* Title Section */}
            <div>
               <h1 className="text-3xl md:text-4xl lg:text-[44px] font-extrabold tracking-tight text-white leading-tight">
                  National Competition Arena
               </h1>
               <p className="text-base font-medium mt-2 uppercase tracking-widest text-amber-500/80">
                  Compete. Rank. Advance.
               </p>
            </div>

            {/* Flattened Event Details */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-amber-500/40 text-amber-500 text-[10px] font-bold rounded-md uppercase tracking-wider bg-amber-500/5">
                <Award className="w-3.5 h-3.5" /> FEATURED EVENT
              </div>

              <div>
                 <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-white">
                   {featuredChallenge.title}
                 </h2>
                 <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-400">
                    <span className="px-2 py-0.5 bg-white/10 text-white text-xs font-bold rounded uppercase tracking-wider">
                      {featuredChallenge.category}
                    </span>
                    <span>{featuredChallenge.difficulty}</span>
                    <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-gray-500" /> {featuredChallenge.totalQuestions} Questions</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-500" /> {featuredChallenge.durationInMinutes} Minutes</span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div> {featuredChallenge.participantsCount.toLocaleString()} Participants</span>
                 </div>
              </div>
            </div>

            {/* Action Buttons Tightly Packed */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsBriefingOpen(true)}
                className="flex items-center justify-center gap-2 px-6 bg-[#df7d46] text-white h-12 rounded-xl font-bold text-sm hover:bg-[#c86b2e] transition-all shadow-[0_0_24px_rgba(223,125,70,0.4)] hover:shadow-[0_0_32px_rgba(223,125,70,0.6)] hover:-translate-y-0.5"
              >
                <span>Enter Competition</span> <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsBriefingOpen(true)}
                className="flex items-center justify-center px-6 bg-white/5 border border-white/10 text-gray-200 h-12 rounded-xl font-bold text-sm hover:bg-white/10 hover:text-white transition-all shadow-lg"
              >
                View Rules
              </button>
            </div>
          </div>
        </div>

        {/* Hero Footer: Status Strip */}
        <div className="relative z-10 w-full bg-black/30 border-t border-white/5 px-8 py-4 backdrop-blur-sm">
           <div className="flex flex-wrap items-center justify-between gap-6 md:gap-8 max-w-4xl">
              
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-emerald-400" />
                 </div>
                 <div>
                   <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Live</div>
                   <div className="text-sm font-bold text-gray-200">{stats?.live || 0} Competitions</div>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-blue-400" />
                 </div>
                 <div>
                   <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Upcoming</div>
                   <div className="text-sm font-bold text-gray-200">{stats?.upcoming || 0} Events</div>
                 </div>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-amber-400" />
                 </div>
                 <div>
                   <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Your Rank</div>
                   <div className="text-sm font-bold text-gray-200">{stats?.rank ? `#${stats.rank}` : "Unranked"}</div>
                 </div>
              </div>

              <div className="hidden lg:flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-400" />
                 </div>
                 <div>
                   <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Streak</div>
                   <div className="text-sm font-bold text-gray-200">{stats?.streak || 0} Days</div>
                 </div>
              </div>

           </div>
        </div>
      </section>

      <ChallengePreviewModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        challenge={featuredChallenge}
      />
    </>
  );
}
