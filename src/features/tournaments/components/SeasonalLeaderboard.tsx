import { TournamentLeaderboardWithUser } from '@/types/tournaments';
import { Trophy, Medal, Award } from "lucide-react";

interface SeasonalLeaderboardProps {
  entries: TournamentLeaderboardWithUser[];
  currentUserId?: string;
}

export function SeasonalLeaderboard({ entries, currentUserId }: SeasonalLeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="font-bold text-gray-400 w-5 text-center">{rank}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Global Leaderboard
        </h3>
        <span className="text-xs font-medium text-gray-500">Live Rankings</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="p-4 pl-6 w-20">Rank</th>
              <th className="p-4">Aspirant</th>
              <th className="p-4 text-right">Score</th>
              <th className="p-4 text-right">Accuracy</th>
              <th className="p-4 pr-6 text-right w-32">Challenges</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                  No participants yet. Be the first to join!
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    entry.userId === currentUserId ? "bg-blue-50/50" : ""
                  }`}
                >
                  <td className="p-4 pl-6 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {entry.user.name?.substring(0, 2).toUpperCase() ||
                          entry.user.username?.substring(0, 2).toUpperCase() ||
                          "US"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {entry.user.name || entry.user.username || "Anonymous Aspirant"}
                        </p>
                        {entry.userId === currentUserId && (
                          <span className="text-[10px] font-bold text-blue-600 uppercase">You</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-black text-[#0A1C40]">{entry.totalScore}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-sm font-medium text-gray-700">
                      {entry.averageAccuracy.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <span className="text-sm font-medium text-gray-500">
                      {entry.totalChallengesCompleted}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
