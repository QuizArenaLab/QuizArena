import { LeaderboardReadModel } from "../../../read-model/LeaderboardReadModel";

export function StatisticsRegion({ data }: { data: LeaderboardReadModel }) {
  const stats = [
    { label: "Total Participants", value: data.statistics.participantCount },
    { label: "Highest Score", value: data.statistics.highestScore },
    { label: "Avg Score", value: data.statistics.averageScore.toFixed(1) },
    { label: "Avg Accuracy", value: `${data.statistics.averageAccuracy.toFixed(1)}%` },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-6">Leaderboard Statistics</h3>
      <div className="space-y-4">
        {stats.map((s, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-slate-400">{s.label}</span>
            <span className="text-white font-medium">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
