"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import type { AbuseTrendPoint } from "@/types/reports";

interface AbuseTrendsChartProps {
  trends: AbuseTrendPoint[];
  fullWidth?: boolean;
}

export function AbuseTrendsChart({ trends, fullWidth }: AbuseTrendsChartProps) {
  const maxReports = Math.max(...trends.map((t) => t.reports), 1);

  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 ${fullWidth ? "w-full" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#0A1C40] flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-gray-400" />
          Abuse Trends (14 Days)
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-400" />
            <span className="text-[10px] text-gray-400 font-medium">Reports</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            <span className="text-[10px] text-gray-400 font-medium">Resolved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-orange-400" />
            <span className="text-[10px] text-gray-400 font-medium">Critical</span>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="space-y-1.5">
        {trends.map((point) => (
          <div key={point.date} className="flex items-center gap-3 group">
            <span className="text-[10px] text-gray-400 font-medium w-12 text-right shrink-0">
              {point.date}
            </span>
            <div className="flex-1 flex items-center gap-1 h-5">
              {/* Reports bar */}
              <div
                className="h-4 rounded-sm bg-gradient-to-r from-red-400 to-red-500 transition-all duration-300 group-hover:opacity-90"
                style={{
                  width: `${Math.max((point.reports / maxReports) * 100, 2)}%`,
                  maxWidth: "60%",
                }}
              />
              {/* Resolved bar */}
              {point.resolved > 0 && (
                <div
                  className="h-4 rounded-sm bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300 group-hover:opacity-90"
                  style={{
                    width: `${Math.max((point.resolved / maxReports) * 100, 2)}%`,
                    maxWidth: "30%",
                  }}
                />
              )}
              {/* Critical bar */}
              {point.critical > 0 && (
                <div
                  className="h-4 rounded-sm bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 group-hover:opacity-90"
                  style={{
                    width: `${Math.max((point.critical / maxReports) * 100, 2)}%`,
                    maxWidth: "20%",
                  }}
                />
              )}
              {/* Values */}
              <span className="text-[10px] text-gray-400 font-medium ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {point.reports}r / {point.resolved}s / {point.critical}c
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {trends.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-400 font-medium">
              Total:{" "}
              <span className="text-gray-600 font-bold">
                {trends.reduce((s, t) => s + t.reports, 0)}
              </span>{" "}
              reports
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">
            Resolved:{" "}
            <span className="text-emerald-600 font-bold">
              {trends.reduce((s, t) => s + t.resolved, 0)}
            </span>
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            Critical:{" "}
            <span className="text-red-600 font-bold">
              {trends.reduce((s, t) => s + t.critical, 0)}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
