import { UserRewardsReadModel } from "@/features/competitions/rewards/read-model/RewardReadModel";
import { Award, Trophy, History } from "lucide-react";

export function OverviewRegion({ data }: { data: UserRewardsReadModel }) {
  const stats = [
    { label: "Certificates", value: data.certificates.length, icon: Award, color: "text-yellow-500" },
    { label: "Badges", value: data.badges.length, icon: Trophy, color: "text-blue-500" },
    { label: "Ledger Events", value: data.history.length, icon: History, color: "text-slate-400" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-lg">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
          <div>
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
