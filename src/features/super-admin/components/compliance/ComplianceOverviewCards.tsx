/**
 * QuizArena — Compliance Overview Cards
 *
 * Aggregate stats panel for the compliance center header:
 * - Total governance events
 * - Events by time window (24h, 7d, 30d)
 * - Severity breakdown
 * - CRITICAL events count
 * - Immutability enforcement status
 *
 * Server component — no client state.
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import type { ComplianceOverview } from "@/types/super-admin-compliance";
import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  Clock,
  Lock,
  Users,
  TrendingUp,
  Database,
} from "lucide-react";

interface ComplianceOverviewCardsProps {
  overview: ComplianceOverview;
}

function StatCard({
  label,
  value,
  subLabel,
  icon: Icon,
  colorClass,
  bgClass,
  borderClass,
}: {
  label: string;
  value: string | number;
  subLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}) {
  return (
    <div className={`p-4 rounded-xl border ${bgClass} ${borderClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className={`text-2xl font-bold tabular-nums ${colorClass}`}>{value}</p>
          {subLabel && <p className="text-[10px] text-slate-600 mt-0.5 truncate">{subLabel}</p>}
        </div>
        <div className={`p-2 rounded-lg shrink-0 ${bgClass}`}>
          <Icon className={`w-4 h-4 ${colorClass}`} />
        </div>
      </div>
    </div>
  );
}

export function ComplianceOverviewCards({ overview }: ComplianceOverviewCardsProps) {
  const { bySeverity } = overview;

  return (
    <div className="space-y-4">
      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <StatCard
          label="Total Events"
          value={overview.totalEvents.toLocaleString()}
          subLabel="All-time audit trail"
          icon={Database}
          colorClass="text-slate-100"
          bgClass="bg-slate-900/60"
          borderClass="border-slate-800/60"
        />
        <StatCard
          label="Last 24h"
          value={overview.events24h.toLocaleString()}
          subLabel="Recent governance"
          icon={Clock}
          colorClass="text-blue-300"
          bgClass="bg-blue-950/20"
          borderClass="border-blue-900/30"
        />
        <StatCard
          label="Last 7 Days"
          value={overview.events7d.toLocaleString()}
          subLabel="Weekly activity"
          icon={TrendingUp}
          colorClass="text-indigo-300"
          bgClass="bg-indigo-950/20"
          borderClass="border-indigo-900/30"
        />
        <StatCard
          label="CRITICAL 24h"
          value={overview.criticalEvents24h.toLocaleString()}
          subLabel="HIGH + CRITICAL events"
          icon={AlertTriangle}
          colorClass={overview.criticalEvents24h > 0 ? "text-orange-400" : "text-slate-500"}
          bgClass={overview.criticalEvents24h > 0 ? "bg-orange-950/20" : "bg-slate-900/40"}
          borderClass={
            overview.criticalEvents24h > 0 ? "border-orange-900/30" : "border-slate-800/40"
          }
        />
        <StatCard
          label="Unique Actors"
          value={overview.uniqueActors.toLocaleString()}
          subLabel="Governance actors"
          icon={Users}
          colorClass="text-purple-300"
          bgClass="bg-purple-950/20"
          borderClass="border-purple-900/30"
        />
        <StatCard
          label="High-Risk 7d"
          value={overview.highRiskEvents7d.toLocaleString()}
          subLabel="HIGH + CRITICAL events"
          icon={Activity}
          colorClass={overview.highRiskEvents7d > 5 ? "text-amber-400" : "text-slate-400"}
          bgClass={overview.highRiskEvents7d > 5 ? "bg-amber-950/20" : "bg-slate-900/40"}
          borderClass={
            overview.highRiskEvents7d > 5 ? "border-amber-900/30" : "border-slate-800/40"
          }
        />
      </div>

      {/* Severity Distribution + Immutability Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Severity Breakdown */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            Severity Distribution (All Time)
          </h3>
          <div className="space-y-2">
            {(
              [
                {
                  key: "SEVERE" as const,
                  label: "SEVERE",
                  color: "bg-red-500",
                  textColor: "text-red-400",
                  count: bySeverity.SEVERE,
                },
                {
                  key: "CRITICAL" as const,
                  label: "CRITICAL",
                  color: "bg-orange-500",
                  textColor: "text-orange-400",
                  count: bySeverity.CRITICAL,
                },
                {
                  key: "HIGH" as const,
                  label: "HIGH",
                  color: "bg-amber-500",
                  textColor: "text-amber-400",
                  count: bySeverity.HIGH,
                },
                {
                  key: "MEDIUM" as const,
                  label: "MEDIUM",
                  color: "bg-blue-500",
                  textColor: "text-blue-400",
                  count: bySeverity.MEDIUM,
                },
                {
                  key: "LOW" as const,
                  label: "LOW",
                  color: "bg-slate-600",
                  textColor: "text-slate-400",
                  count: bySeverity.LOW,
                },
              ] as const
            ).map((item) => {
              const total = Math.max(overview.totalEvents, 1);
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.key} className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold w-14 shrink-0 ${item.textColor}`}>
                    {item.label}
                  </span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${Math.max(pct, item.count > 0 ? 2 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 w-12 text-right tabular-nums shrink-0">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Immutability + Enforcement Status */}
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-emerald-300">
                    Immutable Audit Storage Active
                  </p>
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-950 border border-emerald-800/40 rounded-full px-1.5 py-0.5">
                    ENFORCED
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  All governance events are append-only. No audit deletion, mutation, or overwrite
                  is permitted. Compliance data is server-authoritative and immutable by
                  architecture.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-200 mb-1">
                  SUPER_ADMIN Sovereignty Enforced
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  This compliance center is isolated from ADMIN, MODERATOR, and USER access. All
                  queries are server-authoritative. RBAC enforcement is DB-level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
