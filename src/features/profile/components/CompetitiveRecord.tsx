import { Trophy, Medal, Target, Flame, Activity, Star } from "lucide-react";

interface CompetitiveRecordProps {
  competitionsPlayed?: number;
  bestNationalRank?: number | null;
  currentNationalRank?: number | null;
  bestPercentile?: number | null;
  leaderboardAppearances?: number;
  highestStreak?: number;
  badgesEarned?: number;
}

export function CompetitiveRecord({
  competitionsPlayed = 0,
  bestNationalRank = null,
  currentNationalRank = null,
  bestPercentile = null,
  leaderboardAppearances = 0,
  highestStreak = 0,
  badgesEarned = 0,
}: CompetitiveRecordProps) {
  const stats = [
    {
      label: "Competitions Played",
      value: competitionsPlayed.toString(),
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Best Rank",
      value: bestNationalRank ? `#${bestNationalRank}` : "—",
      icon: Trophy,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Current Rank",
      value: currentNationalRank ? `#${currentNationalRank}` : "—",
      icon: Medal,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Best Percentile",
      value: bestPercentile ? `${bestPercentile}th` : "—",
      icon: Target,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Leaderboard Hits",
      value: leaderboardAppearances.toString(),
      icon: Star,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Highest Streak",
      value: `${highestStreak}d`,
      icon: Flame,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 text-gray-500">
        <Trophy className="w-4 h-4 text-gray-400" />
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-700">
          Competitive Record
        </h2>
      </div>

      <div className="p-6 flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 content-start">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-100 hover:border-gray-200 transition-colors group h-[72px]"
          >
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                {stat.label}
              </div>
              <div className="text-xl font-black text-navy group-hover:text-primary transition-colors">
                {stat.value}
              </div>
            </div>
            <div
              className={`p-2 rounded-lg bg-white shadow-xs border border-gray-100 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}
            >
              <stat.icon className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
