import type { OperationalAlertData } from "@/types/super-admin-dashboard";
import { AlertTriangle, Bell, Info } from "lucide-react";
import Link from "next/link";

export function AlertCenter({ data }: { data: OperationalAlertData }) {
  const { activeAlerts } = data;

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-lg bg-amber-950/30">
          <Bell className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100 tracking-tight">Operational Alerts</h3>
          <p className="text-xs text-slate-500">Live platform warnings</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2 pb-6">
            <Info className="w-6 h-6 opacity-50" />
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          activeAlerts.map((alert) => {
            let color = "text-blue-400";
            let bg = "bg-blue-950/20";
            let border = "border-blue-900/30";

            if (alert.severity === "CRITICAL" || alert.severity === "EMERGENCY") {
              color = "text-red-400";
              bg = "bg-red-950/20";
              border = "border-red-900/40";
            } else if (alert.severity === "WARNING") {
              color = "text-amber-400";
              bg = "bg-amber-950/20";
              border = "border-amber-900/40";
            }

            return (
              <div key={alert.id} className={`p-4 rounded-xl border ${border} ${bg} flex gap-3`}>
                <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-bold ${color} truncate`}>{alert.title}</p>
                    <span className="text-[10px] font-medium text-slate-500 shrink-0">
                      {alert.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{alert.description}</p>
                  {alert.actionUrl && (
                    <Link
                      href={alert.actionUrl}
                      className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider ${color} hover:opacity-80 transition-opacity`}
                    >
                      Investigate &rarr;
                    </Link>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
