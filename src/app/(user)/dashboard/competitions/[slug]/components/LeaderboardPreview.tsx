import { getLeaderboardPreview } from "@/features/competitions/experience/actions/landing.actions";
import { Medal, User as UserIcon } from "lucide-react";
import Link from "next/link";

interface LeaderboardPreviewProps {
  slug: string;
}

export async function LeaderboardPreview({ slug }: LeaderboardPreviewProps) {
  const { topEntries, userEntry } = await getLeaderboardPreview(slug);

  return (
    <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Medal className="w-5 h-5 text-yellow-500" />
          Leaderboard Preview
        </h2>
        <Link href={`/dashboard/competitions/${slug}/leaderboard`} className="text-sm text-blue-400 hover:text-blue-300 font-medium">
          View Full
        </Link>
      </div>

      {userEntry && (
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {userEntry.rank}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Your Best Rank</p>
              <p className="text-xs text-slate-400">Score: {userEntry.score}</p>
            </div>
          </div>
        </div>
      )}

      {topEntries.length === 0 ? (
        <div className="text-center py-8 text-slate-400 bg-slate-950 rounded-xl border border-slate-800/50">
          <Medal className="w-8 h-8 mx-auto mb-2 opacity-20" />
          <p>Be the first to dominate the leaderboard.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {topEntries.map((entry: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800/50">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-bold w-4 text-center">{entry.rank}</span>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                  {entry.avatar ? (
                    <img src={entry.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <span className="font-medium text-slate-300">{entry.displayName}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-white">{entry.score} pts</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
