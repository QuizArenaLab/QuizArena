import { LeaderboardReadModel } from "../../../read-model/LeaderboardReadModel";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function LeaderboardTable({ data }: { data: LeaderboardReadModel }) {
  if (data.paginatedRankings.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
        <p className="text-slate-400">No rankings available for this leaderboard yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-700/50 text-slate-400 text-sm">
              <th className="p-4 font-medium">Rank</th>
              <th className="p-4 font-medium">Participant</th>
              <th className="p-4 font-medium">Score</th>
              <th className="p-4 font-medium">Accuracy</th>
              <th className="p-4 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {data.paginatedRankings.map((user) => (
              <tr 
                key={user.userId} 
                className={`
                  hover:bg-slate-800/30 transition-colors
                  ${data.currentUserPosition?.userId === user.userId ? "bg-blue-900/20" : ""}
                `}
              >
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg">#{user.rank}</span>
                    {user.rankChange === "UP" && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {user.rankChange === "DOWN" && <TrendingDown className="w-4 h-4 text-red-500" />}
                    {user.rankChange === "SAME" && <Minus className="w-4 h-4 text-slate-500" />}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <img src={user.image} alt="Avatar" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-400">{user.name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="font-medium text-white">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 font-bold text-blue-400">{user.score}</td>
                <td className="p-4 text-slate-300">{user.accuracy.toFixed(1)}%</td>
                <td className="p-4 text-slate-400">{Math.floor(user.completionTime / 60)}m {user.completionTime % 60}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Basic Cursor Pagination Footer */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between text-sm">
        <span className="text-slate-400">Showing top {data.paginatedRankings.length} of {data.statistics.participantCount}</span>
        {data.hasNextPage && (
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
