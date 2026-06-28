import { LeaderboardReadModel } from "../../../read-model/LeaderboardReadModel";
import { Trophy } from "lucide-react";

export function TopRankingsRegion({ data }: { data: LeaderboardReadModel }) {
  if (data.topRankings.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Trophy className="text-yellow-500 w-6 h-6" /> Top 3 Competitors
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {data.topRankings.map((user) => (
          <div 
            key={user.userId} 
            className={`
              bg-slate-900 border rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden
              ${user.rank === 1 ? "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]" : 
                user.rank === 2 ? "border-slate-300/50" : 
                "border-amber-700/50"}
            `}
          >
            {user.rank === 1 && <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />}
            {user.rank === 2 && <div className="absolute top-0 left-0 w-full h-1 bg-slate-300" />}
            {user.rank === 3 && <div className="absolute top-0 left-0 w-full h-1 bg-amber-700" />}

            <div className="text-4xl font-black text-slate-800 absolute -right-2 -top-2 opacity-50 pointer-events-none">
              #{user.rank}
            </div>

            {user.image ? (
              <img src={user.image} alt="Avatar" className="w-20 h-20 rounded-full mb-4 z-10" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4 z-10">
                <span className="text-2xl font-bold text-slate-400">{user.name.charAt(0)}</span>
              </div>
            )}
            <h3 className="text-lg font-bold text-white mb-1">{user.name}</h3>
            <p className="text-sm font-semibold text-blue-400 mb-4">{user.score} pts</p>
            
            <div className="flex justify-between w-full text-sm">
              <div className="text-slate-400">Acc: <span className="text-white font-medium">{user.accuracy.toFixed(1)}%</span></div>
              <div className="text-slate-400">Time: <span className="text-white font-medium">{Math.floor(user.completionTime / 60)}m</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
