import { getCompetitionRewards } from "@/features/competitions/experience/actions/landing.actions";
import { Gift, Coins, Trophy, Award } from "lucide-react";

interface RewardsPreviewProps {
  slug: string;
}

export async function RewardsPreview({ slug }: RewardsPreviewProps) {
  const rewards = await getCompetitionRewards(slug);

  if (!rewards || rewards.rewardPool === 0) {
    return (
      <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Skill Practice</h2>
            <p className="text-slate-400 text-sm mt-1">This competition is designed for practice and does not offer monetary rewards.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Gift className="w-5 h-5 text-purple-400" />
        Rewards & Prizes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 flex flex-col items-center justify-center text-center">
          <Coins className="w-8 h-8 text-amber-500 mb-2" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Pool</p>
          <p className="text-2xl font-bold text-white">{rewards.rewardPool} {rewards.currency}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 flex flex-col items-center justify-center text-center">
          <Trophy className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Winner Reward</p>
          <p className="font-bold text-slate-300 text-sm">Leaderboard Recognition</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 flex flex-col items-center justify-center text-center">
          <Award className="w-8 h-8 text-purple-400 mb-2" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Badges</p>
          <p className="font-bold text-slate-300 text-sm">Profile Badges (Top 10)</p>
        </div>
      </div>
    </section>
  );
}
