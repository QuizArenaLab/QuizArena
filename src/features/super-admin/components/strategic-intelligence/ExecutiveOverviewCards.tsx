"use client";

import { BusinessKPIs, StrategicHealthState } from "@/types/super-admin-strategic";
import { Users, CreditCard, TrendingUp, UserMinus, Activity } from "lucide-react";

interface ExecutiveOverviewCardsProps {
  kpis: BusinessKPIs;
  healthState: StrategicHealthState;
}

export function ExecutiveOverviewCards({ kpis, healthState }: ExecutiveOverviewCardsProps) {
  const cards = [
    {
      title: "Total Platform Users",
      value: new Intl.NumberFormat("en-US").format(kpis.totalUsers),
      trend: "+4.2% MoM",
      trendPositive: true,
      icon: Users,
      color: "blue",
    },
    {
      title: "Monthly Recurring Revenue",
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
        kpis.mrrAmount
      ),
      trend: `${kpis.mrrGrowthVelocity > 0 ? "+" : ""}${kpis.mrrGrowthVelocity}% MoM`,
      trendPositive: kpis.mrrGrowthVelocity > 0,
      icon: CreditCard,
      color: "emerald",
    },
    {
      title: "Platform Retention Rate",
      value: `${kpis.retentionRate}%`,
      trend: "-1.2% MoM",
      trendPositive: false,
      icon: TrendingUp,
      color: "indigo",
    },
    {
      title: "Current Churn Rate",
      value: `${kpis.churnRate}%`,
      trend: "+0.4% MoM",
      trendPositive: false, // higher churn is bad
      icon: UserMinus,
      color: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Health Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between shadow-lg ${
          healthState === "STABLE"
            ? "bg-emerald-950/20 border-emerald-900/50"
            : healthState === "WATCH"
              ? "bg-amber-950/20 border-amber-900/50"
              : "bg-red-950/20 border-red-900/50"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              healthState === "STABLE"
                ? "bg-emerald-900/40 text-emerald-500"
                : healthState === "WATCH"
                  ? "bg-amber-900/40 text-amber-500"
                  : "bg-red-900/40 text-red-500"
            }`}
          >
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Strategic Platform Health</h3>
            <p className="text-sm text-slate-400">
              Current executive assessment of operational trajectory
            </p>
          </div>
        </div>
        <div
          className={`px-4 py-1.5 rounded-full border text-sm font-bold tracking-widest uppercase ${
            healthState === "STABLE"
              ? "bg-emerald-950 border-emerald-500/50 text-emerald-400"
              : healthState === "WATCH"
                ? "bg-amber-950 border-amber-500/50 text-amber-400"
                : "bg-red-950 border-red-500/50 text-red-400"
          }`}
        >
          {healthState}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group hover:border-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-semibold text-slate-400">{card.title}</p>
                <div className={`p-2 rounded-lg bg-${card.color}-950/30 text-${card.color}-500`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-100 mb-1">{card.value}</h4>
                <p
                  className={`text-xs font-semibold ${card.trendPositive ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {card.trend}
                </p>
              </div>

              {/* Decorative accent */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${card.color}-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
