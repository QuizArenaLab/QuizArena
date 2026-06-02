"use client";

import { useMemo } from "react";

interface LineChartProps {
  data: Array<{ date: string; value: number; label?: string }>;
  color?: string;
  height?: number;
  showArea?: boolean;
}

export function SimpleLineChart({
  data,
  color = "#6366f1",
  height = 200,
  showArea = true,
}: LineChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return null;
    const max = Math.max(...data.map((d) => d.value));
    const min = Math.min(...data.map((d) => d.value));
    const range = max - min || 1;
    const padding = 20;
    const chartHeight = height - padding * 2;

    const points = data.map((d, i) => ({
      x: (i / (data.length - 1 || 1)) * 100,
      y: ((max - d.value) / range) * chartHeight + padding,
      value: d.value,
      date: d.date,
    }));

    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${(p.x / 100) * (height - 40)} ${p.y}`)
      .join(" ");

    const areaD =
      pathD +
      ` L ${(points[points.length - 1].x / 100) * (height - 40)} ${height - 20} L 20 ${height - 20} Z`;

    return { points, pathD, areaD, max, min };
  }, [data, height]);

  if (!chartData || !data.length) {
    return (
      <div className="flex items-center justify-center text-zinc-500 text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${height - 40} ${height}`}
        preserveAspectRatio="none"
      >
        {showArea && (
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
        )}
        {showArea && <path d={chartData.areaD} fill="url(#areaGradient)" />}
        <path
          d={chartData.pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {chartData.points.slice(0, 5).map((point, i) => (
          <circle key={i} cx={(point.x / 100) * (height - 40)} cy={point.y} r="4" fill={color} />
        ))}
      </svg>
      <div className="flex justify-between mt-2 text-xs text-zinc-500">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
  horizontal?: boolean;
}

export function SimpleBarChart({ data, height = 200, horizontal = false }: BarChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return null;
    const max = Math.max(...data.map((d) => d.value)) || 1;
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

    return data.map((d, i) => ({
      ...d,
      percentage: (d.value / max) * 100,
      color: d.color || colors[i % colors.length],
    }));
  }, [data]);

  if (!chartData) {
    return (
      <div className="flex items-center justify-center text-zinc-500 text-sm">
        No data available
      </div>
    );
  }

  if (horizontal) {
    return (
      <div className="space-y-3">
        {chartData.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 w-16 truncate">{item.label}</span>
            <div className="flex-1 h-6 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
              />
            </div>
            <span className="text-xs text-zinc-600 w-12 text-right">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" style={{ height }}>
      <div className="absolute bottom-6 left-0 right-0 flex items-end justify-center gap-2">
        {chartData.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className="w-10 rounded-t-md transition-all duration-500"
              style={{
                height: `${Math.max(item.percentage * 1.5, 4)}px`,
                backgroundColor: item.color,
              }}
            />
            <span className="text-xs text-zinc-500 truncate w-12">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = "#6366f1",
  label,
}: ProgressRingProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-zinc-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-zinc-800">{Math.round(percentage)}%</span>
        {label && <span className="text-xs text-zinc-500">{label}</span>}
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, subtitle, trend, icon }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-zinc-100 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-zinc-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-zinc-400 mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-zinc-400">{icon}</div>}
      </div>
      {trend !== undefined && (
        <div className={`text-xs mt-2 ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}
