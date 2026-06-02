import type { InfrastructureHealthData } from "@/types/super-admin-dashboard";
import { Server, CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { ROUTES } from '@/constants/routes';

interface InfrastructureHealthGridProps {
  data: InfrastructureHealthData;
}

export function InfrastructureHealthGrid({ data }: InfrastructureHealthGridProps) {
  const components = [
    data.auth,
    data.database,
    data.cronJobs,
    data.publishing,
    data.moderation,
    data.analytics,
  ];

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/60 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-950/30">
            <Server className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">Infrastructure</h3>
            <p className="text-xs text-slate-500">Platform operational status</p>
          </div>
        </div>
        <Link
          href={ROUTES.SUPER_ADMIN.INFRASTRUCTURE}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Full Dashboard &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {components.map((comp) => {
          let StatusIcon = CheckCircle2;
          let statusColor = "text-emerald-400";
          let statusBg = "bg-emerald-950/20 border-emerald-900/40";

          if (comp.status === "WARNING") {
            StatusIcon = AlertTriangle;
            statusColor = "text-amber-400";
            statusBg = "bg-amber-950/20 border-amber-900/40";
          } else if (comp.status === "CRITICAL") {
            StatusIcon = XCircle;
            statusColor = "text-red-400";
            statusBg = "bg-red-950/20 border-red-900/40";
          }

          return (
            <div key={comp.id} className={`p-4 rounded-xl border ${statusBg} flex flex-col gap-3`}>
              <div className="flex items-start justify-between">
                <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                <span className="text-[10px] font-bold text-slate-500 tracking-wider">
                  {comp.uptime}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-200">{comp.name}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-slate-800/60 text-xs text-slate-500">
        <Clock className="w-3.5 h-3.5" />
        <span>Last checked: {data.lastChecked.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
