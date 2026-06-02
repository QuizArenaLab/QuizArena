"use client";

import { Award, ChevronRight, History } from "lucide-react";
import Link from "next/link";

export function RecentCompetitions() {
  const recentEvents = [
    {
      id: "recent-1",
      title: "SSC Quant Sprint",
      rank: 182,
      date: "May 31",
      resultSlug: "ssc-quant-sprint-result", // Mock link
    },
    {
      id: "recent-2",
      title: "Daily Current Affairs Quiz",
      rank: 45,
      date: "May 30",
      resultSlug: "daily-ca-result",
    },
  ];

  if (recentEvents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
        <History className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-gray-900 mb-1">No Participation History</h3>
        <p className="text-gray-500 text-xs">Join a competition to start building your record.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-5">
      <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-2">
        {recentEvents.map((event) => (
          <div key={event.id} className="relative pl-6">
            {/* Timeline node */}
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full left-[-7px] top-1.5 border-2 border-white"></div>
            
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1 leading-tight">{event.title}</h4>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Award className="w-3.5 h-3.5" /> Rank #{event.rank}
                  </span>
                  <span className="text-xs font-medium text-gray-400">{event.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
         <Link href="/dashboard/analytics" className="text-xs font-bold text-gray-500 hover:text-primary transition-colors">
            Show More
         </Link>
      </div>
    </div>
  );
}
