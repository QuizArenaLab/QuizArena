import type { RecentActivityItem } from "@/features/admin/services/question-bank-dashboard";
import { Clock } from "lucide-react";

interface RecentActivityTableProps {
  activities: RecentActivityItem[];
}

const actionLabels: Record<string, { label: string; color: string }> = {
  CREATED: { label: "Created", color: "bg-blue-100 text-blue-800" },
  UPDATED: { label: "Edited", color: "bg-gray-100 text-gray-800" },
  SUBMITTED_FOR_REVIEW: { label: "Submitted", color: "bg-violet-100 text-violet-800" },
  APPROVED: { label: "Published", color: "bg-emerald-100 text-emerald-800" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-800" },
  FLAGGED: { label: "Flagged", color: "bg-orange-100 text-orange-800" },
  ARCHIVED: { label: "Archived", color: "bg-slate-100 text-slate-800" },
  BULK_IMPORTED: { label: "Imported", color: "bg-cyan-100 text-cyan-800" },
  VERSION_CREATED: { label: "Versioned", color: "bg-indigo-100 text-indigo-800" },
  SNAPSHOT_GENERATED: { label: "Snapshot", color: "bg-teal-100 text-teal-800" },
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function RecentActivityTable({ activities }: RecentActivityTableProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-8 text-center">
        <Clock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-400">No recent activity in the last 7 days</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          Recent Activity
        </h3>
      </div>
      <div className="divide-y divide-gray-50">
        {activities.map((activity) => {
          const actionMeta = actionLabels[activity.action] || {
            label: activity.action,
            color: "bg-gray-100 text-gray-800",
          };
          return (
            <div
              key={activity.id}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/50 transition-colors"
            >
              <span
                className={`${actionMeta.color} text-[10px] font-bold px-2 py-0.5 rounded-md min-w-[72px] text-center uppercase`}
              >
                {actionMeta.label}
              </span>
              <span className="text-sm text-gray-900 font-medium truncate flex-1">
                {activity.questionCode || activity.questionId.slice(0, 8)}
              </span>
              <span className="text-xs text-gray-500 hidden sm:inline truncate max-w-[120px]">
                {activity.actorName || "System"}
              </span>
              <span className="text-xs text-gray-400 tabular-nums whitespace-nowrap">
                {formatTimeAgo(activity.createdAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
