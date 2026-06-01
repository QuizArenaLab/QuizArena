import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { getLatestChallenge, getActiveChallenges } from "@/actions/challenge";
import { getPerformanceOverview } from "@/actions/performance";
import Link from "next/link";
import { Trophy, Target, Clock, Play, Zap, Users, ArrowRight, Shield, Award, Crown, TrendingUp, Key } from "lucide-react";
import { ChallengeGridClient } from "@/components/challenges/ChallengeGridClient";
import { EXAM_CATEGORY_LABELS } from "@/lib/onboarding";

export default async function ChallengesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const [latestChallenge, activeChallenges, performance] = await Promise.all([
    getLatestChallenge(),
    getActiveChallenges(),
    getPerformanceOverview(session.user.id),
  ]);

  const hasRank = performance && performance.totalAttempts > 0;

  return (
    <div className="min-h-screen bg-gray-50 -m-6 sm:-m-8 p-6 sm:p-8 space-y-12">
      
      {/* SECTION 1 - COMPETITIVE ARENA HERO */}
      <section className="relative rounded-2xl overflow-hidden bg-navy text-white shadow-xl flex flex-col justify-center py-6 md:py-10 px-6 md:px-10 border border-gray-800">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-size-[24px_24px] opacity-20"></div>
           <div
             className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse"
             style={{ animationDuration: "15s" }}
           />
           <div
             className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse"
             style={{ animationDuration: "12s" }}
           />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-md uppercase tracking-widest mb-6">
            <Shield className="w-3.5 h-3.5" /> NATIONAL CHALLENGE ARENA
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white">
            Compete Against Aspirants Across India
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 font-medium mb-10 max-w-2xl">
            Participate in ranked challenges, improve your percentile and climb the national leaderboard.
          </p>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-gray-400 text-sm md:text-base font-bold mb-8">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> Ranking Enabled
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" /> Daily Leaderboard
            </div>
            <div className="flex items-center gap-2">
              <GlobeIcon className="w-4 h-4 text-amber-400" /> National Competition
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LIVE 1,248 Participants
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
             <Link
               href="#live-challenges"
               className="inline-flex items-center justify-center gap-2 bg-primary text-white h-12 px-8 rounded-xl font-bold tracking-wide hover:bg-blue-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
             >
               {activeChallenges.length > 0 ? "Join Challenge" : "Browse Competitions"} <ArrowRight className="w-4 h-4" />
             </Link>
             <Link
               href="/leaderboard"
               className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-gray-200 h-12 px-8 rounded-xl font-bold tracking-wide hover:bg-white/10 hover:text-white transition-all shadow-sm"
             >
               View Rankings <Crown className="w-4 h-4 text-amber-400" />
             </Link>
          </div>
        </div>
      </section>



      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" id="live-challenges">
        {/* SECTION 3 - LIVE CHALLENGES (Left Column) */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                Live Competitions
                <span className="bg-amber-100 text-amber-700 text-sm px-2.5 py-0.5 rounded-full font-bold">
                  {activeChallenges.length}
                </span>
              </h2>
            </div>
          </div>
          <ChallengeGridClient challenges={activeChallenges} />
        </section>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* SECTION 5 - RANKING PREVIEW */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Your Competitive Position
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
               {hasRank ? (
                 <>
                   <div className="bg-navy p-5 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-size-[12px_12px] opacity-10"></div>
                      <Crown className="w-8 h-8 text-amber-400 mx-auto mb-2 relative z-10" />
                      <div className="text-xs font-bold text-amber-400/80 uppercase tracking-widest mb-1 relative z-10">National Rank</div>
                      <div className="text-3xl font-black text-white relative z-10">#{performance?.rank || "---"}</div>
                   </div>
                   <div className="p-5 space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                         <span className="text-sm text-gray-500 font-bold">National Rank</span>
                         <span className="text-sm font-black text-gray-900">{hasRank ? `#${performance?.rank}` : "---"}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                         <span className="text-sm text-gray-500 font-bold">Percentile</span>
                         <span className="text-sm font-black text-gray-900">{hasRank ? `${Math.round(performance?.averageAccuracy || 0)}%` : "---"}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                         <span className="text-sm text-gray-500 font-bold">Challenges Played</span>
                         <span className="text-sm font-black text-gray-900">{performance?.totalAttempts || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-sm text-gray-500 font-bold">Best Rank</span>
                         <span className="text-sm font-black text-gray-900">---</span>
                      </div>
                   </div>
                 </>
               ) : (
                 <div className="p-8 text-center">
                    <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Not Ranked Yet</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Participate in your first challenge to enter the leaderboard.
                    </p>
                    <Link href="#live-challenges" className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-900 h-10 px-6 rounded-lg font-bold hover:bg-gray-200 transition-colors w-full">
                      Browse Challenges
                    </Link>
                 </div>
               )}
            </div>
          </section>

          {/* SECTION 4 - PRIVATE CHALLENGES */}
          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Challenge With Friends
              </h2>
              <p className="text-xs text-gray-400 mt-1 mb-2 leading-relaxed">
                Create or join private competitions<br />using invitation codes.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                 <Key className="w-4 h-4 text-gray-400" />
                 <span className="text-sm font-bold text-gray-700">Enter Invite Code</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="CODE-XXXX"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all uppercase"
                />
                <button className="shrink-0 bg-gray-900 text-white hover:bg-gray-800 px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm">
                  Join
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
