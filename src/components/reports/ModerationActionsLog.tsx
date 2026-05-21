"use client";

import { Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import type { ModerationActionRecord } from "@/types/reports";

interface ModerationActionsLogProps {
  actions: ModerationActionRecord[];
  fullWidth?: boolean;
}

function formatTimeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ModerationActionsLog({ actions, fullWidth }: ModerationActionsLogProps) {
  if (actions.length === 0) {
    return (
      <div
        className={`bg-white rounded-xl border border-gray-100 p-8 text-center ${fullWidth ? "w-full" : ""}`}
      >
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Activity className="w-5 h-5 text-gray-300" />
        </div>
        <p className="text-sm text-gray-400">No moderation actions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 ${fullWidth ? "w-full" : ""}`}>
      <h3 className="text-sm font-bold text-[#0A1C40] flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-gray-400" />
        Recent Moderation Actions
      </h3>

      <div className="space-y-3">
        {actions.map((action) => {
          const isResolved = action.action.includes("Resolved");

          return (
            <div
              key={action.id}
              className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-1.5 rounded-lg ${isResolved ? "bg-emerald-50" : "bg-gray-100"}`}>
                {isResolved ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[#0A1C40]">{action.action}</p>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-2.5 h-2.5" />
                    {formatTimeAgo(action.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{action.description}</p>
                <p className="text-[10px] text-gray-400 mt-1">by {action.performedBy}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
