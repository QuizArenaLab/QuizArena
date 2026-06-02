"use client";

import { Target, Shield, Zap } from "lucide-react";

interface ReadinessRadarProps {
  readinessScore: number;
  disciplineIndex: number;
  averageAccuracy: number;
}

export function ReadinessRadar({
  readinessScore,
  disciplineIndex,
  averageAccuracy,
}: ReadinessRadarProps) {
  // Determine overall readiness tier
  const getTier = (score: number) => {
    if (score >= 80)
      return {
        label: "COMPETITIVE",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
      };
    if (score >= 50)
      return {
        label: "DEVELOPING",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    return {
      label: "NEEDS FOCUS",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    };
  };

  const tier = getTier(readinessScore);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#0A1C40] uppercase tracking-wider">
          Competitive Readiness
        </h3>
        <Shield className="w-5 h-5 text-gray-400" />
      </div>

      <div className="p-8 flex-1 flex flex-col items-center justify-center relative">
        {/* Simple Ring Visualization */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#F3F4F6" strokeWidth="8" />
            {/* Foreground Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={
                readinessScore >= 80 ? "#2563EB" : readinessScore >= 50 ? "#D97706" : "#DC2626"
              }
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(readinessScore / 100) * 283} 283`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black ${tier.color}`}>
              {Math.round(readinessScore)}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Score
            </span>
          </div>
        </div>

        <div className={`mt-6 px-4 py-1 rounded-full border ${tier.bg} ${tier.border}`}>
          <span className={`text-xs font-black tracking-widest ${tier.color}`}>{tier.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 bg-gray-50">
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Discipline
            </span>
          </div>
          <span className="text-lg font-black text-[#0A1C40]">{Math.round(disciplineIndex)}</span>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Accuracy
            </span>
          </div>
          <span className="text-lg font-black text-[#0A1C40]">{averageAccuracy.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
