import { LeaderboardReadModel } from "../../../read-model/LeaderboardReadModel";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

export function CurrentUserRegion({ data }: { data: LeaderboardReadModel }) {
  if (!data.currentUserPosition) return null;

  const pos = data.currentUserPosition;
  
  return (
    <div className="bg-linear-to-r from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        {pos.image ? (
          <img src={pos.image} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-blue-500" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center border-2 border-blue-500">
            <span className="text-xl font-bold text-slate-400">{pos.name.charAt(0)}</span>
          </div>
        )}
        <div>
          <p className="text-sm text-blue-400 font-semibold mb-1">Your Standing</p>
          <h2 className="text-2xl font-bold text-white">{pos.name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full md:w-auto text-center md:text-left">
        <div>
          <p className="text-sm text-slate-400">Rank</p>
          <p className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
            #{pos.rank}
            {pos.rankChange === "UP" && <TrendingUp className="w-5 h-5 text-green-500" />}
            {pos.rankChange === "DOWN" && <TrendingDown className="w-5 h-5 text-red-500" />}
            {pos.rankChange === "SAME" && <Minus className="w-5 h-5 text-slate-500" />}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Score</p>
          <p className="text-2xl font-bold text-white">{pos.score}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Percentile</p>
          <p className="text-2xl font-bold text-yellow-400">{pos.percentile.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Time</p>
          <p className="text-2xl font-bold text-white">{Math.floor(pos.completionTime / 60)}m {pos.completionTime % 60}s</p>
        </div>
      </div>
    </div>
  );
}
