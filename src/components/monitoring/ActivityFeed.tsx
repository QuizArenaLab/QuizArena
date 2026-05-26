"use client";

import { Trophy, UserPlus, Shield, CheckCircle, XCircle, Zap, Clock, Activity } from "lucide-react";
import type { ActivityEvent, ActivityType } from "@/types/monitoring";

interface ActivityFeedProps {
  events: ActivityEvent[];
}

const ACTIVITY_CONFIG: Record<ActivityType, { icon: typeof Trophy; color: string; bg: string }> = {
  CHALLENGE_LIVE: { icon: Trophy, color: "text-emerald-600", bg: "bg-emerald-50" },
  CHALLENGE_ENDED: { icon: Clock, color: "text-gray-500", bg: "bg-gray-100" },
  CHALLENGE_CREATED: { icon: Trophy, color: "text-blue-600", bg: "bg-blue-50" },
  MODERATION_APPROVED: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  MODERATION_REJECTED: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
  USER_REGISTERED: { icon: UserPlus, color: "text-sky-600", bg: "bg-sky-50" },
  USER_SUSPENDED: { icon: Shield, color: "text-red-500", bg: "bg-red-50" },
  ROLE_CHANGED: { icon: Shield, color: "text-violet-600", bg: "bg-violet-50" },
  JOB_FAILED: { icon: Zap, color: "text-red-500", bg: "bg-red-50" },
  JOB_COMPLETED: { icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
  LOGIN_ATTEMPT: { icon: Shield, color: "text-amber-600", bg: "bg-amber-50" },
  SYSTEM_EVENT: { icon: Activity, color: "text-gray-600", bg: "bg-gray-100" },
};

function formatFeedTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          <span className="text-sm font-bold text-[#0A1C40]">Live Activity Feed</span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">Last 24 hours</span>
      </div>

      {/* Event List */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gray-100" />

        <div className="space-y-0">
          {events.map((event) => {
            const config = ACTIVITY_CONFIG[event.type] ?? ACTIVITY_CONFIG.SYSTEM_EVENT;
            const Icon = config.icon;

            return (
              <div key={event.id} className="relative flex items-start gap-3 py-3 pl-1 group">
                {/* Timeline Dot */}
                <div
                  className={`relative z-10 p-1.5 rounded-lg ${config.bg} shrink-0 transition-transform duration-200 group-hover:scale-110`}
                >
                  <Icon className={`w-3 h-3 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 -mt-0.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-xs font-semibold text-[#0A1C40] truncate">{event.title}</h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {formatFeedTime(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed truncate">
                    {event.description}
                  </p>
                  {event.actor && (
                    <p className="text-[10px] text-gray-400 mt-0.5">by {event.actor}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-8">
          <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No recent activity</p>
          <p className="text-[11px] text-gray-400 mt-1">
            Platform events will appear here in real-time
          </p>
        </div>
      )}
    </div>
  );
}
