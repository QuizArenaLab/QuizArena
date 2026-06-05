"use client";

import { Activity, Shield, UserX, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { ModerationActionRecord } from "@/types/reports";
import { useState } from "react";

interface ModerationActivityFeedProps {
  actions: ModerationActionRecord[];
}

export function ModerationActivityFeed({ actions: initialActions }: ModerationActivityFeedProps) {
  // In a real implementation with true server pagination, we would fetch more from the server.
  // Here, we'll implement client-side pagination on the initial dataset for the MVP structure,
  // but the structure supports standard data-table patterns.
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(initialActions.length / itemsPerPage);
  
  const currentActions = initialActions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm" id="moderation-activity-feed">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-navy" />
          <h2 className="text-base font-bold text-navy">Recent Moderation Activity</h2>
        </div>
      </div>

      {initialActions.length === 0 ? (
        <div className="p-8 text-center">
          <Shield className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">No recent moderation activity</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Moderator</th>
                <th className="px-5 py-3 font-medium">Target</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {currentActions.map((action, idx) => {
                let actionColor = "text-gray-700 bg-gray-100";
                let actionLabel = action.action;
                let targetLabel = action.reportId ? `Report #${action.reportId.substring(0, 6)}` : "Unknown";

                if (action.action.includes("SUSPENDED") || action.action.includes("RESTRICTED")) {
                  actionColor = "text-red-700 bg-red-100";
                  if (action.action === "USER_SUSPENDED") actionLabel = "User Suspended";
                  if (action.action === "USER_RESTRICTED") actionLabel = "User Restricted";
                  targetLabel = "@user"; // Target user ID isn't directly in standard record yet, use report for now or fetch it
                } else if (action.action.includes("RESOLVED")) {
                  actionColor = "text-emerald-700 bg-emerald-100";
                  actionLabel = "Report Resolved";
                } else if (action.action.includes("DISMISSED")) {
                  actionColor = "text-gray-600 bg-gray-200";
                  actionLabel = "Report Dismissed";
                } else if (action.action.includes("WARNED")) {
                  actionColor = "text-orange-700 bg-orange-100";
                  actionLabel = "User Warned";
                  targetLabel = "@user";
                }

                const timeString = new Date(action.timestamp).toLocaleString("en-US", {
                  month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
                });

                return (
                  <tr key={action.id || idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${actionColor}`}>
                        {actionLabel}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-navy">
                      {action.performedBy}
                    </td>
                    <td className="px-5 py-3 text-gray-600 font-mono text-xs">
                      {targetLabel}
                    </td>
                    <td className="px-5 py-3 text-gray-600 max-w-xs truncate" title={action.description}>
                      {action.description || "—"}
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-gray-500 whitespace-nowrap">
                      {timeString}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <span className="text-xs text-gray-500 font-medium">
            Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, initialActions.length)} of {initialActions.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-navy disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-navy disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
