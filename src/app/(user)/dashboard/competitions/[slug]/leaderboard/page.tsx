import { getLeaderboardAction } from "@/features/competitions/leaderboard/actions/leaderboard.actions";
import { HeroRegion } from "@/features/competitions/leaderboard/components/regions/hero/HeroRegion";
import { CurrentUserRegion } from "@/features/competitions/leaderboard/components/regions/currentUser/CurrentUserRegion";
import { TopRankingsRegion } from "@/features/competitions/leaderboard/components/regions/topRankings/TopRankingsRegion";
import { LeaderboardTable } from "@/features/competitions/leaderboard/components/regions/table/LeaderboardTable";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LeaderboardKeyGenerator } from "@/features/competitions/ranking/engine/LeaderboardKeyGenerator";

export default async function CompetitionLeaderboardPage({ params }: { params: { slug: string } }) {
  // Translate slug to competitionId
  const comp = await prisma.competition.findUnique({
    where: { slug: params.slug },
    select: { id: true }
  });

  if (!comp) notFound();

  const leaderboardKey = LeaderboardKeyGenerator.competition(comp.id);
  const result = await getLeaderboardAction(leaderboardKey);

  if (!result.success || !result.data) {
    // If not found, perhaps it just hasn't generated yet
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Leaderboard is currently being computed or not available.
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
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Competition Rules</h3>
              <p className="text-slate-400 text-sm">Rankings are determined by Highest Score. Ties are broken by Highest Accuracy, then Lowest Time.</p>
            </div>
            {/* For competition leaderboard, filters may not be necessary as it's isolated, 
                but we can reuse Statistics */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Participants</span>
                  <span className="text-white font-medium">{data.statistics.participantCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Highest Score</span>
                  <span className="text-white font-medium">{data.statistics.highestScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Avg Accuracy</span>
                  <span className="text-white font-medium">{data.statistics.averageAccuracy.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
