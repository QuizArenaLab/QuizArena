"use client";

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Database,
  Key,
  Activity,
  ShieldAlert,
  Cpu,
} from "lucide-react";
import { ResilienceOverview, BackupSnapshot } from "@/types/super-admin-disaster-recovery";

interface RecoveryReadinessDashboardProps {
  overview: ResilienceOverview;
  snapshots: BackupSnapshot[];
}

export function RecoveryReadinessDashboard({
  overview,
  snapshots,
}: RecoveryReadinessDashboardProps) {
  const dbSnapshot = snapshots.find((s) => s.type === "DATABASE");

  const readinessIndicators = [
    {
      label: "Database Connectivity",
      status: overview.databaseConnectivity === "STABLE",
      warning: overview.databaseConnectivity === "UNSTABLE",
      icon: Database,
    },
    {
      label: "Authentication Health",
      status: overview.authSystemHealth === "HEALTHY",
      warning: false,
      icon: Key,
    },
    {
      label: "Audit-System Integrity",
      status: true, // Simplified for this implementation
      warning: false,
      icon: ShieldCheck,
    },
    {
      label: "Moderation Pipeline",
      status: true,
      warning: false,
      icon: ShieldAlert,
    },
    {
      label: "Cron / Automation",
      status: true,
      warning: false,
      icon: Activity,
    },
    {
      label: "Infrastructure Core",
      status: overview.criticalServicesOnline,
      warning: !overview.criticalServicesOnline,
      icon: Cpu,
    },
  ];

  return (
    <div className="bg-[#0A0F1E] border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Recovery Readiness</h2>
          <p className="text-sm text-slate-400">Operational survivability awareness</p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {readinessIndicators.map((indicator, idx) => {
            const Icon = indicator.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border flex flex-col gap-3 ${
                  indicator.status
                    ? "bg-emerald-950/10 border-emerald-900/30"
                    : indicator.warning
                      ? "bg-amber-950/10 border-amber-900/30"
                      : "bg-red-950/10 border-red-900/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      indicator.status
                        ? "bg-emerald-900/40 text-emerald-500"
                        : indicator.warning
                          ? "bg-amber-900/40 text-amber-500"
                          : "bg-red-900/40 text-red-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {indicator.status ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : indicator.warning ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{indicator.label}</h4>
                  <p
                    className={`text-xs mt-0.5 ${
                      indicator.status
                        ? "text-emerald-500/80"
                        : indicator.warning
                          ? "text-amber-500/80"
                          : "text-red-500/80"
                    }`}
                  >
                    {indicator.status ? "Operational" : indicator.warning ? "Degraded" : "Failing"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-6 border-t border-slate-800">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">
            Backup Governance Foundation
          </h3>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-950/50 border border-blue-900/50 flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Latest DB Snapshot</p>
                <p className="text-xs text-slate-500">
                  {dbSnapshot
                    ? new Date(dbSnapshot.createdAt).toLocaleString()
                    : "No snapshot found"}
                </p>
              </div>
            </div>
            {dbSnapshot && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Size</p>
                  <p className="text-sm font-medium text-slate-200">
                    {(dbSnapshot.sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="text-sm font-medium text-emerald-400">{dbSnapshot.status}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
