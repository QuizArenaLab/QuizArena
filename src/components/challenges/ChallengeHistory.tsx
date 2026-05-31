"use client";

import { Trophy, Target, Minus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentAttempt {
  id: string;
  challengeName: string;
  score: number;
  accuracy: number;
  rankAchieved: number | null;
  submittedAt: Date | null;
}

interface ChallengeHistoryProps {
  attempts: RecentAttempt[];
}

export function ChallengeHistory({ attempts }: ChallengeHistoryProps) {
  if (!attempts || attempts.length === 0) return null;

  return (
    <div className="w-full">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
        Last 5 Attempts
      </h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/80">
          <div className="col-span-5 md:col-span-6">Challenge</div>
          <div className="col-span-2 hidden md:block text-right">Score</div>
          <div className="col-span-3 md:col-span-2 text-right">Rank</div>
          <div className="col-span-4 md:col-span-2 text-right">Date</div>
        </div>

        <div className="divide-y divide-gray-100">
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50/50 transition-colors"
            >
              <div className="col-span-5 md:col-span-6">
                <div className="font-bold text-gray-900 line-clamp-1">{attempt.challengeName}</div>
                <div className="text-xs text-gray-500 md:hidden flex items-center gap-2 mt-1">
                  <Target className="w-3 h-3 text-gray-400" /> {attempt.accuracy}%
                </div>
              </div>

              <div className="col-span-2 hidden md:flex flex-col items-end">
                <div className="font-mono text-sm font-bold text-primary">{attempt.score}</div>
                <div className="text-xs text-gray-500">{attempt.accuracy}% Acc</div>
              </div>

              <div className="col-span-3 md:col-span-2 flex justify-end">
                {attempt.rankAchieved ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm font-mono font-bold border border-yellow-200">
                    <Trophy className="w-3 h-3 text-yellow-600" /> #{attempt.rankAchieved}
                  </div>
                ) : (
                  <div className="text-gray-400 font-mono text-sm">
                    <Minus className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="col-span-4 md:col-span-2 flex flex-col items-end justify-center">
                <div className="text-sm font-medium text-gray-600 whitespace-nowrap">
                  {attempt.submittedAt
                    ? formatDistanceToNow(new Date(attempt.submittedAt), { addSuffix: true })
                    : "Unknown"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
