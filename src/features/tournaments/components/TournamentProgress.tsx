import { CheckCircle2, Circle, Trophy } from "lucide-react";

interface TournamentProgressProps {
  totalChallenges: number;
  completedChallenges: number;
  totalScore: number;
  averageAccuracy: number;
  currentRank: number | null;
}

export function TournamentProgress({
  totalChallenges,
  completedChallenges,
  totalScore,
  averageAccuracy,
  currentRank,
}: TournamentProgressProps) {
  const percentage = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">
        Your Progression
      </h3>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Rank</p>
          <p className="text-3xl font-black text-[#0A1C40]">{currentRank || "-"}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Score</p>
          <p className="text-3xl font-black text-blue-600">{totalScore}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Accuracy</p>
          <p className="text-3xl font-black text-[#0A1C40]">{averageAccuracy.toFixed(1)}%</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-600">Challenges Completed</span>
          <span className="font-bold text-gray-900">
            {completedChallenges} / {totalChallenges}
          </span>
        </div>

        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {completedChallenges === totalChallenges && totalChallenges > 0 && (
        <div className="mt-6 flex items-start gap-3 bg-green-50 border border-green-200 p-4 rounded-lg">
          <Trophy className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-green-900">Tournament Completed</p>
            <p className="text-xs text-green-700 mt-1">
              Your final ranking will be locked when the tournament ends.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
