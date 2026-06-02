import {
  syncPerformanceIntelligence,
  generatePerformanceInsights,
} from "@/features/analytics/services/performance-intelligence";
import { PerformanceHeatmap } from "@/features/analytics/components/intelligence/PerformanceHeatmap";
import { DeterministicInsights } from "@/features/analytics/components/intelligence/DeterministicInsights";
import { ReadinessRadar } from "@/features/analytics/components/intelligence/ReadinessRadar";
import { DifficultyProgression } from "@/features/analytics/components/intelligence/DifficultyProgression";
import { Brain, Activity } from "lucide-react";

export const metadata = {
  title: "Adaptive Performance Intelligence | QuizArena",
  description: "Deterministic competitive-performance intelligence.",
};

export default async function IntelligenceDashboard() {
  const { profile, categories, difficulties } = await syncPerformanceIntelligence();
  const insights = await generatePerformanceInsights();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-[#0A1C40] tracking-tight">
              Performance Intelligence
            </h1>
          </div>
          <p className="text-gray-500 font-medium ml-13">
            Deterministic evaluation of your competitive maturity and readiness.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-600">
          <Activity className="w-4 h-4 text-green-600" />
          Live Analytics Active
        </div>
      </div>

      {/* Top Row: Readiness & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ReadinessRadar
            readinessScore={profile.readinessScore}
            disciplineIndex={profile.disciplineIndex}
            averageAccuracy={profile.averageAccuracy}
          />
        </div>
        <div className="lg:col-span-2">
          <DeterministicInsights insights={insights} />
        </div>
      </div>

      {/* Bottom Row: Heatmaps & Difficulty */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <PerformanceHeatmap categories={categories} />
        </div>
        <div>
          <DifficultyProgression difficulties={difficulties} />
        </div>
      </div>
    </div>
  );
}
