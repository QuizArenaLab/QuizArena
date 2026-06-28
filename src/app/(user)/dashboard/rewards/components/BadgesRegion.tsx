import { UserRewardsReadModel } from "@/features/competitions/rewards/read-model/RewardReadModel";
import Image from "next/image";

export function BadgesRegion({ data }: { data: UserRewardsReadModel }) {
  if (data.badges.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Acquired Badges</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.badges.map(badge => (
          <div key={badge.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center hover:border-blue-500/50 transition-colors cursor-default">
            {/* Using a placeholder div if icon asset doesn't exist yet */}
            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-3">
               <span className="text-xl">🛡️</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">{badge.metadata.name}</h4>
            <div className="text-xs font-semibold text-blue-400">{badge.metadata.rarity}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
