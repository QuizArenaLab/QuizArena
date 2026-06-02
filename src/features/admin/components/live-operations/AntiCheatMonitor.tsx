import { Shield, EyeOff, Copy, MousePointerClick, Flag } from "lucide-react";
import type { AntiCheatStats } from "@/types/live-operations";
import { formatDistanceToNow } from "date-fns";

interface AntiCheatMonitorProps {
  stats: AntiCheatStats;
}

export function AntiCheatMonitor({ stats }: AntiCheatMonitorProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Tab Switches</span>
            <EyeOff className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xl font-bold text-gray-900 mt-2">{stats.tabSwitchCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Window Blurs</span>
            <Shield className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xl font-bold text-gray-900 mt-2">{stats.blurCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Copy Attempts</span>
            <Copy className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xl font-bold text-gray-900 mt-2">{stats.copyAttempts}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Right Clicks</span>
            <MousePointerClick className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xl font-bold text-gray-900 mt-2">{stats.rightClicks}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Flag className="w-4 h-4 text-red-500" />
            Recent Violations
          </h3>
          <span className="text-xs text-red-600 font-medium">
            {stats.flaggedUsersCount} flagged users
          </span>
        </div>
        <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
          {stats.recentViolations.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No recent violations</div>
          ) : (
            stats.recentViolations.map((v) => (
              <div key={v.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                    {v.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{v.userName}</p>
                    <p className="text-xs text-gray-500">{v.violationType}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(v.reportedAt), { addSuffix: true })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
