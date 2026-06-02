import { AlertTriangle, Info, ShieldAlert, PlayCircle, CheckCircle2 } from "lucide-react";
import type { TimelineEvent } from "@/types/live-operations";
import { formatDistanceToNow } from "date-fns";

interface ActivityTimelineProps {
  events: TimelineEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-sm text-gray-500">No recent activity.</p>
      </div>
    );
  }

  const getIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "START":
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case "SUBMISSION":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "VIOLATION":
        return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case "ANOMALY":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "DISCONNECT":
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-bold text-[#0A1C40] mb-4">Live Activity Timeline</h3>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {events.map((event) => (
          <div key={event.id} className="flex gap-3 relative">
            <div className="flex flex-col items-center">
              <div className="mt-0.5 p-1 bg-gray-50 rounded-full border border-gray-100">
                {getIcon(event.type)}
              </div>
              <div className="w-px h-full bg-gray-100 mt-2" />
            </div>
            <div className="pb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{event.title}</span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
