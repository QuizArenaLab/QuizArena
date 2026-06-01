import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { getLatestChallenge, getActiveChallenges } from "@/actions/challenge";
import { getPerformanceOverview } from "@/actions/performance";
import Link from "next/link";
import { Trophy, Crown, Key, ArrowRight, Shield, Award, Plus } from "lucide-react";
import { ChallengeGridClient } from "@/components/challenges/ChallengeGridClient";
import { FeaturedEvent } from "@/components/challenges/FeaturedEvent";
import { UpcomingEvents } from "@/components/challenges/UpcomingEvents";
import { PremiumCompetitions } from "@/components/challenges/PremiumCompetitions";
import { RecentCompetitions } from "@/components/challenges/RecentCompetitions";

export default async function ChallengesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const [activeChallenges, performance] = await Promise.all([
    getActiveChallenges(),
    getPerformanceOverview(session.user.id),
  ]);

  const hasRank = performance && performance.totalAttempts > 0;

  return (
    <div className="min-h-screen bg-gray-50 -m-6 sm:-m-8 p-6 sm:p-8">
      


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-9 space-y-12">
          
          {/* SECTION 1 - FEATURED EVENT */}
          <section>
            <FeaturedEvent 
              stats={{
                live: activeChallenges.length,
                upcoming: 2,
                rank: hasRank && performance?.rank != null ? performance.rank : null,
                streak: 0
              }}
            />
          </section>

          {/* SECTION 2 - RANKED COMPETITIONS */}
          <section id="ranked-competitions">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                  Ranked Competitions
                </h2>
                <p className="text-sm text-gray-500 mt-1">Compete against aspirants across India.</p>
              </div>
              <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full font-bold">
                {activeChallenges.length} Live
              </span>
            </div>
            <ChallengeGridClient challenges={activeChallenges} />
          </section>

          {/* SECTION 3 - PREMIUM COMPETITIONS */}
          <section>
             <div className="mb-6">
                <h2 className="text-xl font-black text-amber-600 uppercase tracking-tight flex items-center gap-2">
                  <Crown className="w-5 h-5" /> Premium Competitions
                </h2>
                <p className="text-sm text-gray-500 mt-1">Advanced events with exclusive rewards and rankings.</p>
             </div>
             <PremiumCompetitions />
          </section>

          {/* SECTION 4 - UPCOMING EVENTS */}
          <section>
             <div className="mb-6">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                  Upcoming Events
                </h2>
             </div>
             <UpcomingEvents />
          </section>
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-3 space-y-10">

          {/* SECTION 6 - RECENT COMPETITIONS */}
          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Recent Competitions
              </h2>
            </div>
            <RecentCompetitions />
          </section>
          
          {/* SECTION 7 - RANKING PREVIEW */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Your Competitive Position
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="bg-navy p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-size-[12px_12px] opacity-10"></div>
                  <Crown className="w-10 h-10 text-amber-400 mx-auto mb-3 relative z-10" />
                  <div className="text-xs font-bold text-amber-400/80 uppercase tracking-widest mb-1 relative z-10">National Rank</div>
                  <div className="text-4xl font-black text-white relative z-10">{hasRank ? `#${performance?.rank}` : "—"}</div>
               </div>
               <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                     <span className="text-sm text-gray-500 font-bold">Category Rank</span>
                     <span className="text-sm font-black text-gray-900">{hasRank && performance?.rank != null ? `#${Math.max(1, Math.floor(performance.rank / 3))}` : "—"}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                     <span className="text-sm text-gray-500 font-bold">Percentile</span>
                     <span className="text-sm font-black text-emerald-600">{hasRank && performance ? `${Math.round(performance.averageAccuracy || 0)}%ile` : "—"}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                     <span className="text-sm text-gray-500 font-bold">Competitions Played</span>
                     <span className="text-sm font-black text-gray-900">{performance?.totalAttempts || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-gray-500 font-bold">Best Rank</span>
                     <span className="text-sm font-black text-gray-900">{hasRank && performance?.rank != null ? `#${Math.max(1, performance.rank - 12)}` : "—"}</span>
                  </div>
               </div>
            </div>
          </section>

          {/* SECTION 8 - PRIVATE CHALLENGES */}
          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Challenge With Friends
              </h2>
              <p className="text-xs text-gray-400 mt-1 mb-2 leading-relaxed">
                Create private competitions<br />using invite codes.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-gray-300 transition-colors group">
              <div className="flex items-center gap-2 mb-4">
                 <Key className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                 <span className="text-sm font-bold text-gray-900">Join Private Competition</span>
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="CODE-XXXX"
                  className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-3 text-gray-900 font-mono text-sm placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all uppercase"
                />
                <button className="shrink-0 bg-gray-900 text-white hover:bg-gray-800 px-4 py-3 rounded-lg font-bold text-sm transition-all shadow-sm">
                  Join
                </button>
              </div>
              <div className="border-t border-gray-100 pt-4 text-center">
                 <button className="text-xs font-bold text-primary hover:text-blue-700 flex items-center justify-center gap-1 mx-auto transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Create Private Arena
                 </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
