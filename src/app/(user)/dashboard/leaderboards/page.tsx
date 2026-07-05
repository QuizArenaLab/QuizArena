import { getLeaderboardAction } from "@/features/competitions/leaderboard/actions/leaderboard.actions";
import { HeroRegion } from "@/features/competitions/leaderboard/components/regions/hero/HeroRegion";
import { CurrentUserRegion } from "@/features/competitions/leaderboard/components/regions/currentUser/CurrentUserRegion";
import { TopRankingsRegion } from "@/features/competitions/leaderboard/components/regions/topRankings/TopRankingsRegion";
import { LeaderboardTable } from "@/features/competitions/leaderboard/components/regions/table/LeaderboardTable";
import { FiltersRegion } from "@/features/competitions/leaderboard/components/regions/filters/FiltersRegion";
import { StatisticsRegion } from "@/features/competitions/leaderboard/components/regions/statistics/StatisticsRegion";
import { LeaderboardKeyGenerator } from "@/features/competitions/ranking/engine/LeaderboardKeyGenerator";

export const dynamic = "force-dynamic";

export default async function GlobalLeaderboardPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  // Default to global
  let leaderboardKey = LeaderboardKeyGenerator.global();

  if (searchParams.type === "weekly") {
    // Current Week calculation for demo
    leaderboardKey = LeaderboardKeyGenerator.weekly(2026, 26);
  } else if (searchParams.type === "monthly") {
    leaderboardKey = LeaderboardKeyGenerator.monthly(2026, 6);
  }

  const result = await getLeaderboardAction(leaderboardKey);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-2">Leaderboard Unavailable</h2>
        <p className="text-slate-400">This leaderboard has not been generated yet.</p>
      </div>
    );
  }

  const data = result.data;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-12">
        <HeroRegion data={data} />

        <CurrentUserRegion data={data} />

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-12">
            <TopRankingsRegion data={data} />
            <LeaderboardTable data={data} />
          </div>
          <div className="space-y-8">
            <FiltersRegion />
            <StatisticsRegion data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
