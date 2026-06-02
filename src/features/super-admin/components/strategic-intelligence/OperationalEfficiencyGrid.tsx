"use client";

import { OperationalEfficiency } from "@/types/super-admin-strategic";
import { Activity, Server, Zap, ShieldCheck } from "lucide-react";

interface OperationalEfficiencyGridProps {
  efficiency: OperationalEfficiency;
}

export function OperationalEfficiencyGrid({ efficiency }: OperationalEfficiencyGridProps) {
  const items = [
    {
      label: "Moderation Throughput",
      value: `${efficiency.moderationThroughputAvg} / hr`,
      subtext: "Items processed across all queues",
      icon: ShieldCheck,
      color: "emerald",
    },
    {
      label: "Content Publishing Velocity",
      value: `+${efficiency.publishingTrend} / wk`,
      subtext: "New challenges & tournaments created",
      icon: Zap,
      color: "blue",
    },
    {
      label: "Core Infrastructure Uptime",
      value: `${efficiency.infrastructureUptime}%`,
      subtext: "Platform survivability metric",
      icon: Server,
      color: "indigo",
    },
    {
      label: "Global API Latency",
      value: `${efficiency.apiLatencyAvgMs} ms`,
      subtext: "Average round-trip response time",
      icon: Activity,
      color: "amber",
    },
  ];

  return (
    <div className="bg-[#0A0F1E] border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Operational Efficiency</h2>
          <p className="text-sm text-slate-400">Systemic throughput & platform bottlenecks</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 gap-4 flex-1">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-center relative overflow-hidden group hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-8 h-8 rounded-md bg-${item.color}-950/40 text-${item.color}-400 flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-300 leading-tight">{item.label}</h3>
              </div>

              <div className="mt-auto">
                <p className="text-2xl font-bold text-slate-100 tracking-tight">{item.value}</p>
                <p className="text-xs text-slate-500 mt-1">{item.subtext}</p>
              </div>

              {/* Decorative accent */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 bg-${item.color}-500/20 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
