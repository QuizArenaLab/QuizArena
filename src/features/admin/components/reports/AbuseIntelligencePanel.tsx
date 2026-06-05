"use client";

import { ShieldAlert, AlertCircle, Users, UserX, Trophy } from "lucide-react";
import type { AbuseIntelligence } from "@/types/reports";
import { REPORT_TYPE_LABELS } from "@/types/reports";

interface AbuseIntelligencePanelProps {
  intelligence: AbuseIntelligence;
}

export function AbuseIntelligencePanel({ intelligence }: AbuseIntelligencePanelProps) {
  const topAbuse = intelligence.commonAbuseTypes.length > 0 ? intelligence.commonAbuseTypes[0] : null;
  const topUser = intelligence.topUsers.length > 0 ? intelligence.topUsers[0] : null;
  const topComp = intelligence.topCompetitions.length > 0 ? intelligence.topCompetitions[0] : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
        <ShieldAlert className="w-4 h-4 text-navy" />
        <h2 className="text-sm font-bold text-navy">Abuse Intelligence</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Most Common Abuse */}
        <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-gray-500" />
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Most Common Abuse</h3>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-sm font-semibold text-navy truncate">
              {topAbuse ? REPORT_TYPE_LABELS[topAbuse.type] : "Spam Links"}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${topAbuse ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-500"}`}>
              {topAbuse ? topAbuse.count : 0} reports
            </span>
          </div>
        </div>

        {/* Repeat Offenders */}
        <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/50">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-500" />
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Repeat Offenders</h3>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-sm font-semibold text-navy truncate">Active Offenders</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${intelligence.repeatOffendersCount > 0 ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-500"}`}>
              {intelligence.repeatOffendersCount} Users
            </span>
          </div>
        </div>

        {/* Top Reported User */}
        <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/50">
          <div className="flex items-center gap-2 mb-2">
            <UserX className="w-4 h-4 text-gray-500" />
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Top Reported User</h3>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className={`text-sm font-semibold truncate ${topUser ? "text-navy" : "text-gray-400"}`}>
              {topUser ? topUser.name : "No data"}
            </span>
            {topUser && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                {topUser.reportCount} reports
              </span>
            )}
          </div>
        </div>

        {/* Top Reported Competition */}
        <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/50">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-gray-500" />
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Top Reported Competition</h3>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className={`text-sm font-semibold truncate ${topComp ? "text-navy" : "text-gray-400"}`}>
              {topComp ? topComp.title : "No data"}
            </span>
            {topComp && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                {topComp.reportCount} reports
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
