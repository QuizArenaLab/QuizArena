"use client";

interface RevenueTrendChartProps {
  growthRate: number;
}

export function RevenueTrendChart({ growthRate }: RevenueTrendChartProps) {
  // A sleek, premium placeholder for a real Chart.js or Recharts component.
  // We use CSS gradients and minimal styling for a sovereign feel.

  const isPositive = growthRate >= 0;

  return (
    <div className="h-64 w-full flex items-end justify-between space-x-2 pt-8 pb-2">
      {/* Synthetic Bar Heights for Visualization */}
      {[40, 55, 45, 60, 80, 75, 90, 85, 100, 110, 105, 120].map((h, i) => (
        <div key={i} className="relative flex flex-col items-center justify-end w-full group">
          <div
            className="w-full rounded-t-sm bg-linear-to-t from-emerald-500/10 to-emerald-500/40 dark:from-emerald-500/20 dark:to-emerald-400/60 transition-all duration-300 group-hover:to-emerald-400 group-hover:from-emerald-500/30"
            style={{ height: `${h}%` }}
          />
        </div>
      ))}
      {/* Overlay Growth Metric */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <span
          className={`text-8xl font-black ${isPositive ? "text-emerald-500" : "text-rose-500"}`}
        >
          {isPositive ? "+" : ""}
          {growthRate}%
        </span>
      </div>
    </div>
  );
}
