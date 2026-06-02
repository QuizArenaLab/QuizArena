import type { TimelineEvent } from "@/types/super-admin-dashboard";
import { Activity, Shield, Server, Crown, Clock } from "lucide-react";

export function ActivityTimeline({ events }: { events: TimelineEvent[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "SECURITY":
        return Shield;
      case "INFRASTRUCTURE":
        return Server;
      case "GOVERNANCE":
        return Crown;
      default:
        return Activity;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "SECURITY":
        return "text-red-400 bg-red-950/30 border-red-900/50";
      case "INFRASTRUCTURE":
        return "text-blue-400 bg-blue-950/30 border-blue-900/50";
      case "GOVERNANCE":
        return "text-purple-400 bg-purple-950/30 border-purple-900/50";
      default:
        return "text-emerald-400 bg-emerald-950/30 border-emerald-900/50";
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-lg bg-slate-800/60">
          <Clock className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100 tracking-tight">Executive Timeline</h3>
          <p className="text-xs text-slate-500">Recent sovereign activity</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-800/60" />
        <div className="space-y-6 relative">
          {events.map((event) => {
            const Icon = getIcon(event.type);
            const colorClass = getColor(event.type);

            return (
              <div key={event.id} className="flex gap-4 relative">
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 ${colorClass}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="pt-1.5 space-y-1 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-200 truncate">{event.title}</p>
                    <span className="text-[10px] font-medium text-slate-500 shrink-0">
                      {event.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{event.description}</p>
                  {event.actor && (
                    <p className="text-[10px] font-medium text-slate-600">by {event.actor}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
