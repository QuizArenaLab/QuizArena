"use client";

import { AuditEntry } from "../audit/types/audit.types";
import { format } from "date-fns";
import { CheckCircle2, Circle, Clock, Play, FileEdit, XCircle, ArrowRightLeft } from "lucide-react";

interface PublishingTimelineProps {
  auditTrail: AuditEntry[];
}

export function PublishingTimeline({ auditTrail }: PublishingTimelineProps) {
  // Take the most recent 10 events for the timeline
  const recentEvents = [...auditTrail].slice(0, 10).reverse();

  const getIcon = (action: string) => {
    switch (action) {
      case "CREATED":
        return <FileEdit className="w-4 h-4 text-blue-500" />;
      case "VALIDATED":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "VALIDATION_FAILED":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "MARKED_READY":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case "PUBLISH_STARTED":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "PUBLISHED":
        return <Play className="w-4 h-4 text-emerald-600" />;
      case "SCHEDULED":
        return <Clock className="w-4 h-4 text-primary" />;
      case "ROLLBACK":
        return <ArrowRightLeft className="w-4 h-4 text-amber-600" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  if (recentEvents.length === 0) return null;

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4 overflow-x-auto whitespace-nowrap hide-scrollbar flex items-center">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-6 sticky left-0 bg-white z-10">
        Timeline
      </span>

      <div className="flex items-center">
        {recentEvents.map((entry, idx) => (
          <div key={entry.id} className="flex items-center group">
            <div className="flex flex-col items-center mx-2">
              <div className="bg-gray-50 border border-gray-200 rounded-full p-1.5 mb-1 shadow-sm group-hover:scale-110 transition-transform">
                {getIcon(entry.action)}
              </div>
              <div className="text-[10px] font-semibold text-gray-600">
                {entry.action.replace("_", " ")}
              </div>
              <div className="text-[9px] text-gray-400">
                {format(new Date(entry.createdAt), "MMM d, HH:mm")}
              </div>
            </div>

            {idx < recentEvents.length - 1 && (
              <div className="w-12 h-[2px] bg-gray-200 mt-[-16px]"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
