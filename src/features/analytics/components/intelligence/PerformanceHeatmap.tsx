"use client";

import { useMemo } from "react";

interface PerformanceHeatmapProps {
  categories: {
    category: string;
    averageAccuracy: number;
    totalAttempts: number;
  }[];
}

export function PerformanceHeatmap({ categories }: PerformanceHeatmapProps) {
  // Use a calm analytical blue scale
  const getColorForAccuracy = (accuracy: number) => {
    if (accuracy >= 80) return "bg-blue-600";
    if (accuracy >= 60) return "bg-blue-400";
    if (accuracy >= 40) return "bg-blue-300";
    if (accuracy >= 20) return "bg-blue-200";
    if (accuracy > 0) return "bg-blue-100";
    return "bg-gray-100";
  };

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => b.averageAccuracy - a.averageAccuracy);
  }, [categories]);

  if (categories.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm font-medium text-gray-500 shadow-sm">
        Insufficient performance data to generate heatmap. Participate in more challenges.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-[#0A1C40] uppercase tracking-wider">
          Category Heatmap
        </h3>
        <span className="text-xs font-bold text-gray-400 uppercase">Accuracy Distribution</span>
      </div>

      <div className="space-y-4">
        {sortedCategories.map((cat) => (
          <div key={cat.category} className="group relative">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                {cat.category}
              </span>
              <span className="text-xs font-black text-[#0A1C40]">
                {cat.averageAccuracy.toFixed(1)}%
              </span>
            </div>
            <div className="h-4 w-full bg-gray-100 rounded overflow-hidden flex">
              <div
                className={`h-full transition-all duration-700 ease-out ${getColorForAccuracy(
                  cat.averageAccuracy
                )}`}
                style={{ width: `${cat.averageAccuracy}%` }}
              />
            </div>
            <div className="mt-1 text-[10px] font-bold text-gray-400 uppercase flex justify-between">
              <span>{cat.totalAttempts} Attempts</span>
              <span>{getColorForAccuracy(cat.averageAccuracy).replace("bg-", "")} Intensity</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-gray-100"></div>0%
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-blue-300"></div>40%
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-blue-600"></div>80%+
        </span>
      </div>
    </div>
  );
}
