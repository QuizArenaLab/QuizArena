import { getUserRewardsAction } from "@/features/competitions/rewards/actions/rewards.actions";
import { OverviewRegion } from "./components/OverviewRegion";
import { CertificatesRegion } from "./components/CertificatesRegion";
import { BadgesRegion } from "./components/BadgesRegion";
import { RewardHistoryRegion } from "./components/RewardHistoryRegion";

export const dynamic = "force-dynamic";

export default async function RewardsDashboardPage() {
  const result = await getUserRewardsAction();

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <p className="text-red-400">{result.error || "Failed to load rewards"}</p>
      </div>
    );
  }

  const data = result.data;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Rewards & Recognition</h1>
          <p className="text-slate-400 text-sm">
            Your digital assets, certificates, and achievements.
          </p>
        </div>

        <OverviewRegion data={data} />

        <CertificatesRegion data={data} />

        <BadgesRegion data={data} />

        <RewardHistoryRegion data={data} />
      </div>
    </div>
  );
}
