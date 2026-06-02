import { Server, Activity, Database, Clock } from "lucide-react";
import type { InfrastructureStatus } from "@/types/live-operations";
import { formatDistanceToNow } from "date-fns";

interface InfrastructureStatusPanelProps {
  status: InfrastructureStatus;
}

export function InfrastructureStatusPanel({ status }: InfrastructureStatusPanelProps) {
  const getHealthColor = (h: string) => {
    switch (h) {
      case "HEALTHY":
        return "text-green-600 bg-green-50 ring-green-500/20";
      case "DEGRADED":
        return "text-amber-600 bg-amber-50 ring-amber-500/20";
      case "CRITICAL":
        return "text-red-600 bg-red-50 ring-red-500/20";
      default:
        return "text-gray-600 bg-gray-50 ring-gray-500/20";
    }
  };

  const getHealthBadge = (h: string) => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ring-1 ${getHealthColor(h)} uppercase`}
    >
      {h}
    </span>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#0A1C40]">Infrastructure Status</h3>
        <span className="text-[10px] text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(status.lastCheckTime), { addSuffix: true })}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-3">
            <Server className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs font-semibold text-gray-900">Timer Synchronization</p>
              <p className="text-[10px] text-gray-500">Global clock deviation checks</p>
            </div>
          </div>
          {getHealthBadge(status.timerSyncHealth)}
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs font-semibold text-gray-900">Autosave Pipeline</p>
              <p className="text-[10px] text-gray-500">Attempt state persistence</p>
            </div>
          </div>
          {getHealthBadge(status.autosaveHealth)}
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs font-semibold text-gray-900">Submission Processor</p>
              <p className="text-[10px] text-gray-500">Evaluation queue health</p>
            </div>
          </div>
          {getHealthBadge(status.submissionPipelineHealth)}
        </div>
      </div>
    </div>
  );
}
