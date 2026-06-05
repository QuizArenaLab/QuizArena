import { Clock, AlertCircle } from "lucide-react";
import type { ReportAgingMetrics } from "@/types/reports";

interface ReportAgingTrackerProps {
  metrics: ReportAgingMetrics;
}

export function ReportAgingTracker({ metrics }: ReportAgingTrackerProps) {
  const total = metrics.under24h + metrics.between24hAnd48h + metrics.over48h;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-bold text-navy">Aging Reports</h3>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm text-gray-600 font-medium">0-24h</span>
          </div>
          <span className="text-sm font-bold text-navy">{metrics.under24h}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-sm text-gray-600 font-medium">24-48h</span>
          </div>
          <span className="text-sm font-bold text-navy">{metrics.between24hAnd48h}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span className="text-sm font-medium text-red-600">48h+</span>
          </div>
          <div className="flex items-center gap-2">
            {metrics.over48h > 0 && <AlertCircle className="w-4 h-4 text-red-600" />}
            <span className="text-sm font-bold text-red-600">{metrics.over48h}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          {total === 0
            ? "No aging reports. Great job!"
            : "Resolve older reports to prevent backlog buildup."}
        </p>
      </div>
    </div>
  );
}
