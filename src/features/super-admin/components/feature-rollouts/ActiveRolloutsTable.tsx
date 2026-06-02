"use client";

import { useState } from "react";
import type { FeatureFlagPayload } from "@/types/super-admin-rollouts";
import { formatDistanceToNow } from "date-fns";
import {
  Rocket,
  ShieldAlert,
  Server,
  Users,
  Activity,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Globe2,
} from "lucide-react";
import { RollbackGovernancePanel } from "./RollbackGovernancePanel";

interface ActiveRolloutsTableProps {
  flags: FeatureFlagPayload[];
}

export function ActiveRolloutsTable({ flags }: ActiveRolloutsTableProps) {
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlagPayload | null>(null);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Rocket className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-bold text-slate-200">Active Rollouts</h2>
        </div>
        <div className="text-xs text-slate-500 font-medium">{flags.length} Features Governed</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800">
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Feature
              </th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Rollout Type
              </th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Environments
              </th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Last Modified
              </th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {flags.map((flag) => {
              const isHighRisk =
                flag.key.includes("auth") ||
                flag.key.includes("security") ||
                flag.key.includes("infra");

              return (
                <tr key={flag.id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="p-4 align-top">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-200">{flag.name}</span>
                        {isHighRisk && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-950/40 text-orange-400 border border-orange-900/40 uppercase tracking-wider">
                            <ShieldAlert className="w-2.5 h-2.5" /> High Risk
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-mono mb-1">{flag.key}</span>
                      {flag.description && (
                        <span className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">
                          {flag.description}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 align-top">
                    {flag.enabled ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 text-slate-500 border border-slate-800 text-[10px] font-bold uppercase tracking-wider">
                        <XCircle className="w-3 h-3" /> Disabled
                      </span>
                    )}
                  </td>

                  <td className="p-4 align-top">
                    <div className="flex items-center gap-2">
                      {flag.rolloutType === "GLOBAL" && (
                        <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      {flag.rolloutType === "PERCENTAGE" && (
                        <Activity className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      {flag.rolloutType === "ROLE_BASED" && (
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      {flag.rolloutType === "USER_BASED" && (
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {flag.rolloutType === "ENVIRONMENT" && (
                        <Server className="w-3.5 h-3.5 text-indigo-400" />
                      )}

                      <span className="text-xs font-medium text-slate-300">
                        {flag.rolloutType}
                        {flag.rolloutType === "PERCENTAGE" && ` (${flag.rolloutValue}%)`}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 align-top">
                    <div className="flex gap-1.5">
                      {["development", "staging", "production"].map((env) => {
                        const active = flag.environments[env as keyof typeof flag.environments];
                        return (
                          <div
                            key={env}
                            className={`w-2 h-2 rounded-full ${
                              active
                                ? env === "production"
                                  ? "bg-red-500"
                                  : "bg-emerald-500"
                                : "bg-slate-800"
                            }`}
                            title={env}
                          />
                        );
                      })}
                    </div>
                  </td>

                  <td className="p-4 align-top">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-300 mb-0.5">
                        {formatDistanceToNow(new Date(flag.updatedAtISO), { addSuffix: true })}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        by {flag.updater?.email || "System"}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 align-top text-right">
                    <button
                      onClick={() => setSelectedFlag(flag)}
                      className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
                      title="Governance Actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedFlag && (
        <RollbackGovernancePanel flag={selectedFlag} onClose={() => setSelectedFlag(null)} />
      )}
    </div>
  );
}
