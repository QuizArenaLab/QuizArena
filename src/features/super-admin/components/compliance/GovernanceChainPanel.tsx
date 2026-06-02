/**
 * QuizArena — Governance Chain Panel
 *
 * Forensic governance chain reconstruction display:
 * - Recent role change audit trail
 * - Platform setting audit trail
 * - Actor → target → action chains
 * - Severity classification
 *
 * Server component — fully pre-rendered.
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import type {
  RoleChangeForensicEntry,
  SettingAuditForensicEntry,
} from "@/types/super-admin-compliance";
import { SeverityBadge } from "./SeverityBadge";
import { Key, Settings, User, ArrowRight, Clock, FileText } from "lucide-react";

interface GovernanceChainPanelProps {
  roleChanges: RoleChangeForensicEntry[];
  settingAudits: SettingAuditForensicEntry[];
}

const ROLE_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  SUPER_ADMIN: {
    text: "text-red-400",
    bg: "bg-red-950/30",
    border: "border-red-900/40",
  },
  ADMIN: {
    text: "text-orange-400",
    bg: "bg-orange-950/30",
    border: "border-orange-900/40",
  },
  MODERATOR: {
    text: "text-amber-400",
    bg: "bg-amber-950/30",
    border: "border-amber-900/40",
  },
  USER: {
    text: "text-slate-400",
    bg: "bg-slate-800/40",
    border: "border-slate-700/40",
  },
};

function RolePill({ role }: { role: string }) {
  const config = ROLE_COLORS[role] ?? ROLE_COLORS.USER;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold font-mono border ${config.text} ${config.bg} ${config.border}`}
    >
      {role}
    </span>
  );
}

function EmptyChainState({ label }: { label: string }) {
  return (
    <div className="py-6 text-center">
      <FileText className="w-6 h-6 text-slate-700 mx-auto mb-2" />
      <p className="text-xs text-slate-600">{label}</p>
    </div>
  );
}

export function GovernanceChainPanel({ roleChanges, settingAudits }: GovernanceChainPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Role Change Chain */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-purple-950/40">
            <Key className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">Role Change Audit</h3>
            <p className="text-[10px] text-slate-600">
              {roleChanges.length} recent privilege changes
            </p>
          </div>
        </div>

        {roleChanges.length === 0 ? (
          <EmptyChainState label="No role changes recorded" />
        ) : (
          <div className="space-y-3">
            {roleChanges.map((change) => (
              <div
                key={change.id}
                className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30"
              >
                {/* Actor → Target chain */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-600" />
                    <span className="text-[10px] font-bold text-slate-300">
                      {change.actor.name ?? change.actor.email ?? change.actor.id.slice(0, 8)}
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-600" />
                    <span className="text-[10px] text-slate-400">
                      {change.target.name ?? change.target.email ?? change.target.id.slice(0, 8)}
                    </span>
                  </div>
                </div>

                {/* Role transition */}
                <div className="flex items-center gap-2 mb-2">
                  <RolePill role={change.previousRole} />
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  <RolePill role={change.newRole} />
                  <div className="ml-auto">
                    <SeverityBadge severity={change.severity} size="xs" />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-slate-700" />
                    <span className="text-[10px] text-slate-600">{change.timeAgo}</span>
                  </div>
                  {change.reason && (
                    <span className="text-[10px] text-slate-600 truncate flex-1">
                      &ldquo;{change.reason}&rdquo;
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Setting Audit Chain */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-violet-950/40">
            <Settings className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200">Setting Change Audit</h3>
            <p className="text-[10px] text-slate-600">
              {settingAudits.length} recent setting modifications
            </p>
          </div>
        </div>

        {settingAudits.length === 0 ? (
          <EmptyChainState label="No setting changes recorded" />
        ) : (
          <div className="space-y-3">
            {settingAudits.map((audit) => (
              <div
                key={audit.id}
                className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30"
              >
                {/* Setting key */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-300 truncate flex-1">
                    {audit.settingKey}
                  </span>
                  <SeverityBadge severity={audit.severity} size="xs" className="ml-2 shrink-0" />
                </div>

                {/* Actor */}
                <div className="flex items-center gap-1 mb-1">
                  <User className="w-3 h-3 text-slate-600" />
                  <span className="text-[10px] text-slate-400">
                    {audit.actor.name ?? audit.actor.email ?? audit.actor.id.slice(0, 8)}
                  </span>
                  <span className="text-slate-700 text-[10px]">·</span>
                  <span className="text-[10px] font-mono text-slate-600">{audit.actor.role}</span>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-slate-700" />
                    <span className="text-[10px] text-slate-600">{audit.timeAgo}</span>
                  </div>
                  {audit.reason && (
                    <span className="text-[10px] text-slate-600 truncate flex-1">
                      &ldquo;{audit.reason}&rdquo;
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
