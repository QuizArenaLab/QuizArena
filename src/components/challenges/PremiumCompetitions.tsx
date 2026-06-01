"use client";

import { Crown, Lock, Shield, Trophy, Sparkles, Award } from "lucide-react";

export function PremiumCompetitions() {
  const premiumEvents = [
    {
      id: "premium-1",
      title: "SSC Elite Championship",
      difficulty: "Advanced",
      reward: "Elite Badge & Recognition",
      prize: "Priority Leaderboard",
      entry: "Challenge Pass Required",
    },
    {
      id: "premium-2",
      title: "UPSC Mains Pro Simulator",
      difficulty: "Expert",
      reward: "Exclusive Ranking",
      prize: "Cash Rewards (Soon)",
      entry: "Premium Only",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {premiumEvents.map((event) => (
        <div
          key={event.id}
          className="relative bg-navy rounded-2xl p-6 md:p-8 hover:shadow-[0_12px_40px_rgba(245,158,11,0.15)] transition-all group overflow-hidden border border-amber-500/20"
        >
          {/* Subtle gold accent background */}
          <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mt-20 -mr-20 pointer-events-none group-hover:bg-amber-500/20 transition-colors"></div>

          {/* Premium Shield Top Right */}
          <div className="absolute top-0 right-6 px-3 py-1.5 bg-linear-to-b from-amber-400 to-amber-600 rounded-b-lg shadow-lg flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-navy fill-navy" />
            <span className="text-[10px] font-black uppercase tracking-widest text-navy">VIP</span>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5" /> Premium
              </span>
              <span className="text-xs font-mono font-bold text-gray-400">
                {event.difficulty}
              </span>
            </div>

            <h3 className="text-2xl font-black text-white mb-6 leading-tight">{event.title}</h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                Reward: <span className="text-white">{event.reward}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                Prize: <span className="text-white">{event.prize}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-300">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                Entry: <span className="text-white">{event.entry}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-[11px] font-bold text-amber-500/80 uppercase tracking-widest">
                Only for Challenge Pass holders
              </p>
              <button className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 group-hover:-translate-y-0.5">
                Unlock Access
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
