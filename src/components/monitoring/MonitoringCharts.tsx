"use client";

import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import type { TrendDataPoint } from "@/types/monitoring";

interface MonitoringChartsProps {
  userActivity: TrendDataPoint[];
  challengeAttempts: TrendDataPoint[];
  failureRate: TrendDataPoint[];
  moderationThroughput: TrendDataPoint[];
}

interface MiniChartProps {
  title: string;
  data: TrendDataPoint[];
  color: string;
  accentColor: string;
}

function MiniChart({ title, data, color, accentColor }: MiniChartProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const currentValue = data[data.length - 1]?.value ?? 0;
  const previousValue = data.length > 1 ? (data[data.length - 2]?.value ?? 0) : 0;

  const changePercent =
    previousValue > 0
      ? Math.round(((currentValue - previousValue) / previousValue) * 100)
      : currentValue > 0
        ? 100
        : 0;

  const direction: "up" | "down" | "stable" =
    changePercent > 0 ? "up" : changePercent < 0 ? "down" : "stable";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-[#0A1C40] uppercase tracking-wider">{title}</h4>
        <div className="flex items-center gap-1">
          {direction === "up" && <TrendingUp className="w-3 h-3 text-emerald-500" />}
          {direction === "down" && <TrendingDown className="w-3 h-3 text-red-500" />}
          {direction === "stable" && <Minus className="w-3 h-3 text-gray-400" />}
          <span
            className={`text-[10px] font-semibold ${
              direction === "up"
                ? "text-emerald-600"
                : direction === "down"
                  ? "text-red-600"
                  : "text-gray-500"
            }`}
          >
            {changePercent > 0 ? "+" : ""}
            {changePercent}%
          </span>
        </div>
      </div>

      {/* Current Value */}
      <p className="text-2xl font-bold text-[#0A1C40] tabular-nums mb-4">
        {currentValue.toLocaleString()}
      </p>

      {/* Bar Chart */}
      <div className="flex items-end gap-1 h-16">
        {data.map((point, index) => {
          const height = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
          const isLast = index === data.length - 1;

          return (
            <div
              key={point.date}
              className="flex-1 flex flex-col items-center gap-1 group relative"
            >
              <div
                className={`w-full rounded-t transition-all duration-300 ${
                  isLast ? accentColor : color
                } ${isLast ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}
                style={{ height: `${Math.max(height, 4)}%`, minHeight: "2px" }}
              />
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0A1C40] text-white text-[9px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                {point.value} • {point.date}
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis Labels */}
      <div className="flex justify-between mt-1.5">
        <span className="text-[9px] text-gray-400">{data[0]?.date}</span>
        <span className="text-[9px] text-gray-400">{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

export function MonitoringCharts({
  userActivity,
  challengeAttempts,
  failureRate,
  moderationThroughput,
}: MonitoringChartsProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-bold text-[#0A1C40]">Operational Trends</span>
        <span className="text-[10px] text-gray-400 font-medium">7-day overview</span>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MiniChart
          title="User Activity"
          data={userActivity}
          color="bg-sky-400"
          accentColor="bg-sky-600"
        />
        <MiniChart
          title="Challenge Attempts"
          data={challengeAttempts}
          color="bg-emerald-400"
          accentColor="bg-emerald-600"
        />
        <MiniChart
          title="Failure Rate"
          data={failureRate}
          color="bg-red-400"
          accentColor="bg-red-600"
        />
        <MiniChart
          title="Moderation Queue"
          data={moderationThroughput}
          color="bg-violet-400"
          accentColor="bg-violet-600"
        />
      </div>
    </div>
  );
}
