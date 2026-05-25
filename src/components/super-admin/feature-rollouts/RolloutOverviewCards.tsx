"use client";

import type { RolloutStats } from "@/types/super-admin-rollouts";
import { Rocket, Activity, FlaskConical, XCircle, ShieldAlert } from "lucide-react";

interface RolloutOverviewCardsProps {
  stats: RolloutStats;
}

export function RolloutOverviewCards({ stats }: RolloutOverviewCardsProps) {
  const cards = [
    {
      title: "Active Rollouts",
      value: stats.activeFeatures,
      subtitle: `of ${stats.totalFeatures} total features`,
      icon: Rocket,
      color: "text-blue-400",
      bg: "bg-blue-950/40 border-blue-900/40",
    },
    {
      title: "Percentage Tests",
      value: stats.percentageRollouts,
      subtitle: "Phased ecosystem deployments",
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40 border-emerald-900/40",
    },
    {
      title: "Experimental",
      value: stats.experimentalFeatures,
      subtitle: "Targeted operational trials",
      icon: FlaskConical,
      color: "text-purple-400",
      bg: "bg-purple-950/40 border-purple-900/40",
    },
    {
      title: "High-Risk Controls",
      value: stats.highRiskFeatures,
      subtitle: "Auth, infra, and governance",
      icon: ShieldAlert,
      color: stats.highRiskFeatures > 0 ? "text-orange-400" : "text-slate-400",
      bg:
        stats.highRiskFeatures > 0
          ? "bg-orange-950/40 border-orange-900/40"
          : "bg-slate-800/60 border-slate-700/50",
    },
    {
      title: "Disabled Features",
      value: stats.disabledFeatures,
      subtitle: "Rolled back or deactivated",
      icon: XCircle,
      color: "text-slate-400",
      bg: "bg-slate-800/60 border-slate-700/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`p-4 rounded-xl border ${card.bg} relative overflow-hidden group`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-slate-900/50 ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className={`text-3xl font-black tracking-tight ${card.color}`}>
                  {card.value}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-300">{card.title}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
