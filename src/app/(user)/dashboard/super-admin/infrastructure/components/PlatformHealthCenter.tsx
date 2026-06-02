"use client";

import { Activity, Database, Server, RefreshCw } from "lucide-react";
import type { InfrastructureHealth } from "@/features/super-admin/services/infrastructure/health";

export function PlatformHealthCenter({ health }: { health: InfrastructureHealth }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "up":
      case "OPERATIONAL":
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "degraded":
      case "DEGRADED":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "down":
      case "CRITICAL":
      case "inactive":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#0A1C40] flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Infrastructure Health
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time status of critical platform systems
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(health.status)}`}
        >
          {health.status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Database */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Database className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="font-medium text-gray-900">Database</span>
            </div>
            <div
              className={`w-2 h-2 rounded-full ${health.database.status === "up" ? "bg-green-500" : health.database.status === "degraded" ? "bg-amber-500" : "bg-red-500"}`}
            />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Latency</span>
              <span className="font-medium">{health.database.latencyMs}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium uppercase">{health.database.status}</span>
            </div>
          </div>
        </div>

        {/* Auth System */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Server className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">Authentication</span>
            </div>
            <div
              className={`w-2 h-2 rounded-full ${health.auth.status === "up" ? "bg-green-500" : "bg-red-500"}`}
            />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Active Sessions</span>
              <span className="font-medium">{health.auth.activeSessionsCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium uppercase">{health.auth.status}</span>
            </div>
          </div>
        </div>

        {/* Automation & Pipelines */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-medium text-gray-900">Pipelines</span>
            </div>
            <div
              className={`w-2 h-2 rounded-full ${health.crons.status === "up" ? "bg-green-500" : "bg-red-500"}`}
            />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Scheduled Jobs</span>
              <span className="font-medium">{health.crons.scheduledJobs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Moderation Queue</span>
              <span className="font-medium">{health.pipelines.moderationQueueSize} items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
