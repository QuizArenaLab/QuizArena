"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Trophy, Clock, Swords, Users, MapPin, ChevronRight, Filter } from "lucide-react";
import { CompetitionLifecycle } from "@/generated/prisma";

interface CompetitionDiscoveryKernelProps {
  initialCompetitions: any[];
}

export function CompetitionDiscoveryKernel({ initialCompetitions }: CompetitionDiscoveryKernelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "LIVE" | "SCHEDULED" | "COMPLETED">("ALL");

  const filteredCompetitions = useMemo(() => {
    return initialCompetitions.filter((comp) => {
      const matchesSearch =
        comp.config?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.config?.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "ALL" || comp.lifecycleState === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [initialCompetitions, searchQuery, activeTab]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-navy tracking-tight">Competitions</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Discover and participate in active challenges.
          </p>
        </div>
        
        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search competitions..."
              aria-label="Search competitions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          {/* Feature Flag: Advanced Filters disabled for MVP */}
        </div>
      </div>

      {/* TABS */}
      <div 
        role="tablist" 
        aria-label="Filter by status"
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {["ALL", "LIVE", "SCHEDULED", "COMPLETED"].map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-navy text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-navy"
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* COMPETITION GRID */}
      {filteredCompetitions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCompetitions.map((comp) => (
            <CompetitionCard key={comp.id} competition={comp} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-navy mb-1">No Competitions Found</h3>
          <p className="text-sm font-medium text-gray-500 max-w-sm">
            We couldn't find any competitions matching your current filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}

function CompetitionCard({ competition }: { competition: any }) {
  const isLive = competition.lifecycleState === "LIVE";
  const isScheduled = competition.lifecycleState === "SCHEDULED";
  
  return (
    <Link href={`/dashboard/competitions/${competition.slug}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative h-full flex flex-col">
        {isLive && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-red-500 text-white rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Live Now</span>
          </div>
        )}
        {isScheduled && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 text-white rounded-full shadow-sm">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Upcoming</span>
          </div>
        )}
        
        {/* Card Header Pattern */}
        <div className={`h-24 w-full relative overflow-hidden ${
          isLive ? "bg-gradient-to-br from-red-500/10 to-orange-500/10" 
          : "bg-gradient-to-br from-gray-100 to-gray-50"
        }`}>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-current opacity-[0.02] rounded-full" />
        </div>

        <div className="p-6 flex-1 flex flex-col relative -mt-8">
          {/* Logo / Icon */}
          <div className="w-16 h-16 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-center mb-4">
            <Trophy className={`w-8 h-8 ${isLive ? "text-orange-500" : "text-gray-400"}`} />
          </div>

          <h3 className="text-xl font-bold text-navy line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {competition.config?.title || "Untitled Competition"}
          </h3>
          <p className="text-sm font-medium text-gray-500 line-clamp-2 mb-6 flex-1">
            {competition.config?.description || "No description provided."}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</span>
              <span className="text-sm font-semibold text-navy flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                {competition.config?.category || "General"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Difficulty</span>
              <span className="text-sm font-semibold text-navy flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-purple-500" />
                {competition.config?.difficulty || "Medium"}
              </span>
            </div>
            {competition.schedule?.startTime && (
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Starts At</span>
                <span className="text-sm font-semibold text-navy flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  {new Date(competition.schedule.startTime).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="w-full flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-xs font-semibold">Public</span>
            </div>
            <span className="text-sm font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View Details <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
