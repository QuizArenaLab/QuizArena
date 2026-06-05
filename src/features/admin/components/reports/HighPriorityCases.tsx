"use client";

import { AlertTriangle, ChevronRight } from "lucide-react";
import type { ReportData } from "@/types/reports";
import { REPORT_TYPE_LABELS, REPORT_PRIORITY_LABELS } from "@/types/reports";

interface HighPriorityCasesProps {
  reports: ReportData[];
  onInvestigate: (report: ReportData) => void;
}

function getPriorityClasses(priority: string) {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-50 text-red-700 border-red-200";
    case "HIGH":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "MEDIUM":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "LOW":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

export function HighPriorityCases({ reports, onInvestigate }: HighPriorityCasesProps) {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
          <AlertTriangle className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-bold text-[#0A1C40]">High Priority Cases</h2>
        </div>
        <div className="p-8 text-center text-gray-500 text-sm">
          No critical incidents currently active.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-red-200 overflow-hidden shadow-sm shadow-red-100">
      <div className="p-4 border-b border-red-100 flex items-center justify-between bg-red-50/50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <h2 className="text-sm font-bold text-red-900">High Priority Cases</h2>
        </div>
        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {reports.length} ACTIVE
        </span>
      </div>

      <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
        {reports.map((report) => (
          <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityClasses(report.priority)}`}>
                {REPORT_PRIORITY_LABELS[report.priority]}
              </span>
              <span className="text-[10px] text-gray-400">
                {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <h3 className="text-sm font-semibold text-[#0A1C40] mb-1">
              {REPORT_TYPE_LABELS[report.type]}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
              {report.reason}
            </p>

            <button
              onClick={() => onInvestigate(report)}
              className="w-full flex items-center justify-between bg-[#0A1C40] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#0A1C40]/90 transition-colors"
            >
              Investigate Case
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
