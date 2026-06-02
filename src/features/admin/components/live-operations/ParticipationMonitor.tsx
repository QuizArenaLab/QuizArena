import { Users, TimerOff, UserMinus, ShieldAlert } from "lucide-react";
import type { LiveParticipant } from "@/types/live-operations";

interface ParticipationMonitorProps {
  participants: LiveParticipant[];
}

export function ParticipationMonitor({ participants }: ParticipationMonitorProps) {
  const activeCount = participants.filter((p) => p.status === "IN_PROGRESS").length;
  const completedCount = participants.filter(
    (p) => p.status === "SUBMITTED" || p.status === "EVALUATED"
  ).length;
  const abandonedCount = participants.filter((p) => p.status === "ABANDONED").length;
  const flaggedCount = participants.filter((p) => p.isFlagged).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase">Active</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{activeCount}</div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-green-100 text-green-600 rounded-lg">
            <TimerOff className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase">Completed</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{completedCount}</div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-gray-100 text-gray-600 rounded-lg">
            <UserMinus className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase">Abandoned</span>
        </div>
        <div className="text-2xl font-bold text-gray-900">{abandonedCount}</div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-red-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-red-600 uppercase">Flagged</span>
        </div>
        <div className="text-2xl font-bold text-red-700">{flaggedCount}</div>
      </div>
    </div>
  );
}
