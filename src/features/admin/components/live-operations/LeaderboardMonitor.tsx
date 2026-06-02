import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

export function LeaderboardMonitor() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <h3 className="text-sm font-bold text-[#0A1C40]">Live Leaderboard (Sample)</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold w-4 text-gray-400">1</span>
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
              JD
            </div>
            <span className="text-sm font-medium text-gray-900">John Doe</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-900">980</span>
            <Minus className="w-4 h-4 text-gray-300" />
          </div>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold w-4 text-gray-400">2</span>
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
              AS
            </div>
            <span className="text-sm font-medium text-gray-900">Alice Smith</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-900">940</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold w-4 text-gray-400">3</span>
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold">
              RJ
            </div>
            <span className="text-sm font-medium text-gray-900">Robert Jones</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-900">890</span>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 mt-4 text-center">
        Real-time leaderboard updates are throttled to ensure infrastructure stability.
      </p>
    </div>
  );
}
