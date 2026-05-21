"use client";

import { Eye, User, Trophy, FileText, Clock, AlertTriangle } from "lucide-react";
import type { ReportData } from "@/types/reports";
import { REPORT_TYPE_LABELS, REPORT_PRIORITY_LABELS, REPORT_STATUS_LABELS } from "@/types/reports";

interface ReportsTableProps {
  reports: ReportData[];
  onInvestigate: (report: ReportData) => void;
  emptyMessage?: string;
}

function getPriorityClasses(priority: string) {
  switch (priority) {
    case "CRITICAL":
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-500",
      };
    case "HIGH":
      return {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        dot: "bg-orange-500",
      };
    case "MEDIUM":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-200",
        dot: "bg-gray-400",
      };
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "OPEN":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
    case "UNDER_REVIEW":
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
    case "RESOLVED":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
    case "DISMISSED":
      return { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200" };
    default:
      return { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200" };
  }
}

function getTargetIcon(report: ReportData) {
  if (report.targetUser) return User;
  if (report.targetChallenge) return Trophy;
  if (report.targetQuestion) return FileText;
  return AlertTriangle;
}

function getTargetLabel(report: ReportData) {
  if (report.targetUser) return report.targetUser.name || report.targetUser.email || "Unknown User";
  if (report.targetChallenge) return report.targetChallenge.title;
  if (report.targetQuestion) return report.targetQuestion.question.slice(0, 60) + "…";
  return "General Report";
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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ReportsTable({ reports, onInvestigate, emptyMessage }: ReportsTableProps) {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-5 h-5 text-emerald-400" />
        </div>
        <p className="text-sm text-gray-500">{emptyMessage || "No reports found."}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Report
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Target
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Reporter
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const priorityClasses = getPriorityClasses(report.priority);
              const statusClasses = getStatusClasses(report.status);
              const TargetIcon = getTargetIcon(report);

              return (
                <tr
                  key={report.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 ${priorityClasses.dot} flex-shrink-0`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0A1C40] truncate max-w-[200px]">
                          {REPORT_TYPE_LABELS[report.type]}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">
                          {report.reason}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <TargetIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-600 truncate max-w-[140px]">
                        {getTargetLabel(report)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${priorityClasses.bg} ${priorityClasses.text} ${priorityClasses.border} border`}
                    >
                      {REPORT_PRIORITY_LABELS[report.priority]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${statusClasses.bg} ${statusClasses.text} ${statusClasses.border} border`}
                    >
                      {REPORT_STATUS_LABELS[report.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-gray-500 truncate max-w-[100px] block">
                      {report.reportedBy.name || "Anonymous"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(report.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => onInvestigate(report)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-[#0A1C40] text-white rounded-lg text-[10px] font-semibold hover:bg-[#0A1C40]/80 transition-all opacity-80 group-hover:opacity-100"
                    >
                      <Eye className="w-3 h-3" />
                      Investigate
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-50">
        {reports.map((report) => {
          const priorityClasses = getPriorityClasses(report.priority);
          const statusClasses = getStatusClasses(report.status);
          const TargetIcon = getTargetIcon(report);

          return (
            <div key={report.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full mt-1 ${priorityClasses.dot} flex-shrink-0`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0A1C40] truncate">
                      {REPORT_TYPE_LABELS[report.type]}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{report.reason}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${priorityClasses.bg} ${priorityClasses.text} flex-shrink-0`}
                >
                  {REPORT_PRIORITY_LABELS[report.priority]}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <TargetIcon className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500 truncate max-w-[120px]">
                      {getTargetLabel(report)}
                    </span>
                  </div>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${statusClasses.bg} ${statusClasses.text}`}
                  >
                    {REPORT_STATUS_LABELS[report.status]}
                  </span>
                </div>
                <button
                  onClick={() => onInvestigate(report)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-[#0A1C40] text-white rounded-lg text-[10px] font-semibold"
                >
                  <Eye className="w-3 h-3" />
                  Investigate
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>by {report.reportedBy.name || "Anonymous"}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(report.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
