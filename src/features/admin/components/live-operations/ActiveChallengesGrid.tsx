import { Users, Clock, TimerOff, PlayCircle } from "lucide-react";
import type { LiveChallenge } from "@/types/live-operations";
import { ChallengeHealthIndicator } from "./ChallengeHealthIndicator";
import { formatDistanceToNow } from "date-fns";

interface ActiveChallengesGridProps {
  challenges: LiveChallenge[];
  onSelect: (id: string) => void;
  selectedId?: string;
}

export function ActiveChallengesGrid({
  challenges,
  onSelect,
  selectedId,
}: ActiveChallengesGridProps) {
  if (challenges.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <PlayCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-gray-900">No Active Challenges</h3>
        <p className="text-xs text-gray-500 mt-1">
          There are no challenges currently in LIVE state.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {challenges.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 ${
            selectedId === c.id
              ? "border-secondary bg-blue-50/50 shadow-sm ring-1 ring-secondary"
              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
          }`}
        >
          <div className="flex justify-between items-start mb-3 w-full">
            <div>
              <h3 className="font-bold text-gray-900 line-clamp-1">{c.title}</h3>
              <p className="text-xs text-gray-500">
                {c.difficulty} • {c.durationInMinutes} mins
              </p>
            </div>
            <ChallengeHealthIndicator healthState={c.healthState} />
          </div>

          <div className="grid grid-cols-2 gap-2 w-full mt-2 pt-3 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400">Active</span>
              <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                {c.activeParticipants}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400">Completed</span>
              <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                <TimerOff className="w-3.5 h-3.5 text-green-500" />
                {c.completedParticipants}
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-gray-500 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Started{" "}
            {c.startsAt
              ? formatDistanceToNow(new Date(c.startsAt), { addSuffix: true })
              : "recently"}
          </div>
        </button>
      ))}
    </div>
  );
}
