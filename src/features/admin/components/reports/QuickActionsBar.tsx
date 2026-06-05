"use client";

import { ShieldAlert, AlertTriangle, Archive, FileText } from "lucide-react";
import type { ReportStatusCounts } from "@/types/reports";

interface QuickActionsBarProps {
  statusCounts: ReportStatusCounts;
  onFilterChange: (status: string | null, priority: string | null) => void;
}

export function QuickActionsBar({ statusCounts, onFilterChange }: QuickActionsBarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-navy">Quick Actions</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onFilterChange("OPEN", null)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
        >
          <ShieldAlert className="w-4 h-4 text-blue-500" />
          Review Open Reports
          {statusCounts.OPEN > 0 && (
            <span className="ml-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {statusCounts.OPEN}
            </span>
          )}
        </button>

        <button
          onClick={() => onFilterChange(null, "CRITICAL")}
          className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium text-red-700 transition-colors"
        >
          <AlertTriangle className="w-4 h-4 text-red-600" />
          Review Critical Cases
          {statusCounts.CRITICAL > 0 && (
            <span className="ml-1 bg-red-200 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {statusCounts.CRITICAL}
            </span>
          )}
        </button>

        <button
          onClick={() => onFilterChange("DISMISSED", null)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
        >
          <Archive className="w-4 h-4 text-gray-500" />
          Review Dismissed Reports
        </button>

        <button
          onClick={() => {
            document.getElementById("moderation-activity-feed")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
        >
          <FileText className="w-4 h-4 text-gray-500" />
          Open Moderation Audit Log
        </button>
      </div>
    </div>
  );
}
