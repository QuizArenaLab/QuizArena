"use client";

import {
  Eye,
  User,
  Trophy,
  FileText,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Activity,
} from "lucide-react";
import type { ReportData } from "@/types/reports";
import { REPORT_TYPE_LABELS, REPORT_PRIORITY_LABELS, REPORT_STATUS_LABELS } from "@/types/reports";

interface ReportsTableProps {
  reports: ReportData[];
  onInvestigate: (report: ReportData) => void;
  platformHealth: import("@/types/reports").PlatformHealthMetrics;
  summary: import("@/types/reports").ReportsSummary;
  totalOpen: number;
}

function getPriorityClasses(priority: string) {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-50 text-red-700 border-red-200";
    case "HIGH":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "MEDIUM":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "LOW":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "UNDER_REVIEW":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "RESOLVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "DISMISSED":
      return "bg-gray-50 text-gray-500 border-gray-200";
    default:
      return "bg-gray-50 text-gray-500 border-gray-200";
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

export function ReportsTable({
  reports,
  onInvestigate,
  platformHealth,
  summary,
  totalOpen,
}: ReportsTableProps) {
  if (reports.length === 0) {
    const isHealthyState = totalOpen === 0;

    if (isHealthyState) {
      return (
        <div className="flex flex-col p-8 h-full bg-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-700">Platform Healthy</h3>
              <p className="text-sm text-gray-500">
                No active moderation actions currently required.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Reports Today
              </p>
              <p className="text-xl font-bold text-navy">{platformHealth.reportsMonitoredToday}</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Comps Monitored
              </p>
              <p className="text-xl font-bold text-navy">{platformHealth.competitionsMonitored}</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Users Monitored
              </p>
              <p className="text-xl font-bold text-navy">{platformHealth.usersMonitored}</p>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Last Resolved
              </p>
              <p className="text-sm font-bold text-navy mt-1 truncate">
                {platformHealth.lastResolvedIncident
                  ? formatTimeAgo(platformHealth.lastResolvedIncident)
                  : "No recent"}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col p-8 h-full bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy">Platform Health Center</h3>
            <p className="text-sm text-gray-500">
              No reports match your current filters. Here is the operational status.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Reports Today
            </p>
            <p className="text-xl font-bold text-navy">{summary.totalReportsToday}</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Critical Cases
            </p>
            <p className="text-xl font-bold text-navy">{summary.totalCritical}</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Avg Resolution
            </p>
            <p className="text-xl font-bold text-navy">{summary.averageResolutionHours}h</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Last Action
            </p>
            <p className="text-sm font-bold text-navy mt-1 truncate">
              {platformHealth.lastResolvedIncident
                ? formatTimeAgo(platformHealth.lastResolvedIncident)
                : "No recent"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto w-full">
        <table className="w-full text-left table-fixed">
          <thead className="bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm shadow-gray-50/50">
            <tr>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-[10%]">
                Priority
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-[15%]">
                Type
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-[18%]">
                Target
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-[20%]">
                Reason
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-[12%]">
                Reported By
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-[10%]">
                Created
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-[10%]">
                Status
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-[5%] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/80">
            {reports.map((report) => {
              const priorityClasses = getPriorityClasses(report.priority);
              const statusClasses = getStatusClasses(report.status);
              const TargetIcon = getTargetIcon(report);

              return (
                <tr key={report.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-4 py-3.5 align-top">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${priorityClasses}`}
                    >
                      {REPORT_PRIORITY_LABELS[report.priority]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <p className="text-xs font-semibold text-[#0A1C40] truncate">
                      {REPORT_TYPE_LABELS[report.type]}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <div className="flex items-center gap-1.5">
                      <TargetIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span
                        className="text-xs text-gray-600 truncate"
                        title={getTargetLabel(report)}
                      >
                        {getTargetLabel(report)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <p className="text-xs text-gray-500 line-clamp-2" title={report.reason}>
                      {report.reason}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <span
                      className="text-xs text-gray-500 truncate block"
                      title={report.reportedBy.name || "Anonymous"}
                    >
                      {report.reportedBy.name || "Anonymous"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(report.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 align-top">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${statusClasses}`}
                    >
                      {REPORT_STATUS_LABELS[report.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 align-top text-right">
                    <button
                      onClick={() => onInvestigate(report)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-[#0A1C40] rounded-lg text-xs font-semibold hover:bg-[#0A1C40] hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 whitespace-nowrap"
                    >
                      Investigate &rarr;
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden divide-y divide-gray-50">
        {reports.map((report) => {
          const priorityClasses = getPriorityClasses(report.priority);
          const statusClasses = getStatusClasses(report.status);
          const TargetIcon = getTargetIcon(report);

          return (
            <div key={report.id} className="p-4 space-y-3 bg-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0A1C40] truncate">
                      {REPORT_TYPE_LABELS[report.type]}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{report.reason}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${priorityClasses}`}
                >
                  {REPORT_PRIORITY_LABELS[report.priority]}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <TargetIcon className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-600 truncate max-w-[120px]">
                      {getTargetLabel(report)}
                    </span>
                  </div>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${statusClasses}`}
                  >
                    {REPORT_STATUS_LABELS[report.status]}
                  </span>
                </div>
                <button
                  onClick={() => onInvestigate(report)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#0A1C40] text-white rounded-lg text-xs font-semibold"
                >
                  Investigate &rarr;
                </button>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span>By: {report.reportedBy.name || "Anonymous"}</span>
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
