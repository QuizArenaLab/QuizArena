"use client";

import { Activity, CalendarDays, Flame, Trophy } from "lucide-react";

export function CompetitionStatusBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm">
      <div className="flex items-center gap-6 divide-x divide-gray-100 w-full sm:w-auto">
        <div className="flex items-center gap-3 pr-6">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
             <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live</div>
            <div className="text-sm font-black text-gray-900">0 Competitions</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
             <CalendarDays className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Upcoming</div>
            <div className="text-sm font-black text-gray-900">2 Events</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 px-6">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
             <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Rank</div>
            <div className="text-sm font-black text-gray-900">Unranked</div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 pl-6">
          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
             <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Streak</div>
            <div className="text-sm font-black text-gray-900">0 Days</div>
          </div>
        </div>
      </div>
    </div>
  );
}
