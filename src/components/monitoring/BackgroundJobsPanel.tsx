"use client";

import { Clock, Zap, AlertCircle, Timer } from "lucide-react";
import type { BackgroundJob } from "@/types/monitoring";
import { StatusBadge } from "./StatusBadge";

interface BackgroundJobsPanelProps {
  jobs: BackgroundJob[];
}

function formatRelativeTime(date: Date | null): string {
  if (!date) return "Never";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatNextRun(date: Date | null): string {
  if (!date) return "On-demand";
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Imminent";
  if (diffMins < 60) return `in ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  return `in ${diffHours}h`;
}

const CATEGORY_COLORS: Record<string, string> = {
  publishing: "bg-blue-50 text-blue-700",
  expiration: "bg-amber-50 text-amber-700",
  moderation: "bg-violet-50 text-violet-700",
  analytics: "bg-emerald-50 text-emerald-700",
  maintenance: "bg-gray-100 text-gray-700",
};

export function BackgroundJobsPanel({ jobs }: BackgroundJobsPanelProps) {
  const activeCount = jobs.filter((j) => j.status === "RUNNING" || j.status === "SUCCESS").length;

  return (
    <div className="space-y-4">
      {/* Header Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-[#0A1C40]">Background Jobs</span>
        </div>
        <span className="text-xs text-gray-500">
          {activeCount}/{jobs.length} active
        </span>
      </div>

      {/* Job Cards */}
      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-[#0A1C40] truncate">{job.name}</h4>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[job.category] ?? "bg-gray-50 text-gray-600"}`}
                  >
                    {job.category}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-snug">{job.description}</p>
              </div>
              <StatusBadge status={job.status} size="sm" pulse={job.status === "RUNNING"} />
            </div>

            {/* Job Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-50">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Last Run</p>
                  <p className="text-xs font-semibold text-[#0A1C40]">
                    {formatRelativeTime(job.lastExecution)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Timer className="w-3 h-3 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Latency</p>
                  <p className="text-xs font-semibold text-[#0A1C40]">
                    {job.executionLatencyMs !== null ? `${job.executionLatencyMs}ms` : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Next</p>
                  <p className="text-xs font-semibold text-[#0A1C40]">
                    {formatNextRun(job.nextScheduled)}
                  </p>
                </div>
              </div>
            </div>

            {/* Failure Count Warning */}
            {job.failureCount > 0 && (
              <div className="mt-3 flex items-center gap-1.5 text-red-600 bg-red-50 rounded-lg px-3 py-1.5">
                <AlertCircle className="w-3 h-3" />
                <span className="text-[11px] font-medium">
                  {job.failureCount} failure{job.failureCount > 1 ? "s" : ""} detected
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
