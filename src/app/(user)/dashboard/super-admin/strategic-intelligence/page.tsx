import { Metadata } from "next";
import { BrainCircuit, RefreshCw } from "lucide-react";
import { requireSuperAdmin } from "@/features/super-admin/services/governance";
import { generateExecutiveOverview } from "@/features/super-admin/services/strategic-intelligence";

import { ExecutiveOverviewCards } from "@/features/super-admin/components/strategic-intelligence/ExecutiveOverviewCards";
import { StrategicInsightsEngine } from "@/features/super-admin/components/strategic-intelligence/StrategicInsightsEngine";
import { GrowthRetentionMetrics } from "@/features/super-admin/components/strategic-intelligence/GrowthRetentionMetrics";
import { AnomalyDetectionPanel } from "@/features/super-admin/components/strategic-intelligence/AnomalyDetectionPanel";
import { OperationalEfficiencyGrid } from "@/features/super-admin/components/strategic-intelligence/OperationalEfficiencyGrid";

export const metadata: Metadata = {
  title: "Strategic Command | Sovereign Control | QuizArena",
  description: "Executive business & growth oversight for QuizArena.",
};

export default async function StrategicIntelligencePage() {
  // DB-authoritative check (fail-closed)
  await requireSuperAdmin();

  // Load server-authoritative strategic intelligence
  const overview = await generateExecutiveOverview();

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
      {/* Sovereign Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/30 border border-indigo-900/50 flex items-center justify-center shadow-lg shadow-indigo-900/20">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight font-hanken">
              Strategic Command
            </h1>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Sovereign executive oversight, growth forecasting, and strategic anomaly detection. All
            metrics are server-authoritative and aggregate global platform trajectory.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start shrink-0">
          <div className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin-slow" />
            <span className="text-xs font-medium text-slate-300">Live Aggregation</span>
          </div>
        </div>
      </div>

      {/* Top Level KPIs */}
      <ExecutiveOverviewCards kpis={overview.kpis} healthState={overview.healthState} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Growth & Analytics) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="h-[400px]">
            <GrowthRetentionMetrics />
          </div>
          <div className="flex-1 min-h-[300px]">
            <OperationalEfficiencyGrid efficiency={overview.efficiency} />
          </div>
        </div>

        {/* Right Column (Insights & Anomalies) */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 min-h-[350px]">
            <StrategicInsightsEngine insights={overview.insights} />
          </div>
          <div className="h-[350px]">
            <AnomalyDetectionPanel anomalies={overview.anomalies} />
          </div>
        </div>
      </div>
    </div>
  );
}
