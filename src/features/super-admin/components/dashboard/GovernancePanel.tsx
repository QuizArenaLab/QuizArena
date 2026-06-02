import type { GovernanceStatusData } from "@/types/super-admin-dashboard";
import { Crown, Users, Activity, History } from "lucide-react";
import Link from "next/link";
import { ROUTES } from '@/constants/routes';

export function GovernancePanel({ data }: { data: GovernanceStatusData }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/60 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-purple-950/30">
            <Crown className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">Governance</h3>
            <p className="text-xs text-slate-500">Authority & Privileges</p>
          </div>
        </div>
        <Link
          href={ROUTES.SUPER_ADMIN.GOVERNANCE}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          Manage Roles &rarr;
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800/60">
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Crown className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Admins</span>
            </div>
            <p className="text-xl font-bold text-slate-200">{data.activeAdmins}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Moderators</span>
            </div>
            <p className="text-xl font-bold text-slate-200">{data.activeModerators}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <History className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Role Changes</span>
            </div>
            <p className="text-xl font-bold text-slate-200">{data.recentRoleChanges}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Audit Events</span>
            </div>
            <p className="text-xl font-bold text-slate-200">{data.auditEvents24h}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
