/**
 * QuizArena — Challenges Page (Practice Arena)
 *
 * Light mode aesthetic redesign.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { getLatestChallenge, getActiveChallenges } from "@/actions/challenge";
import { getRecentAttempts } from "@/actions/performance";
import Link from "next/link";
import { Trophy, Target, Clock, Play, Zap, Users, ArrowRight } from "lucide-react";
import { ChallengeGridClient } from "@/components/challenges/ChallengeGridClient";
import { ChallengeHistory } from "@/components/challenges/ChallengeHistory";

export default async function ChallengesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const [latestChallenge, activeChallenges, recentAttempts] = await Promise.all([
    getLatestChallenge(),
    getActiveChallenges(),
    getRecentAttempts(session.user.id, 5),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 -m-6 sm:-m-8 p-6 sm:p-8 space-y-12">
      {/* SECTION 1 - ACTIVE CHALLENGE HERO */}
      <section className="relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-center py-8 md:py-10 px-8 md:px-12">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle grid pattern for competitive feel */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px]"></div>
          {/* Competitive glow (infinite, low opacity) */}
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse"
            style={{ animationDuration: "15s" }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[120px] animate-pulse"
            style={{ animationDuration: "12s" }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-mono font-bold rounded-md uppercase tracking-widest mb-6 shadow-sm">
            <Zap className="w-3.5 h-3.5" /> Practice Arena
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-8">
            {latestChallenge ? latestChallenge.title : "Daily Challenge"}
          </h1>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-gray-500 font-mono text-sm md:text-base mb-10">
            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-400 text-xs uppercase tracking-widest">Questions</span>
              <span className="text-gray-900 font-bold flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> {latestChallenge?.totalQuestions || 20}{" "}
                Questions
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-400 text-xs uppercase tracking-widest">Duration</span>
              <span className="text-gray-900 font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />{" "}
                {latestChallenge?.durationInMinutes || 20} Minutes
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-400 text-xs uppercase tracking-widest">Ranking</span>
              <span className="text-gray-900 font-bold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" /> National Ranking
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-400 text-xs uppercase tracking-widest">Difficulty</span>
              <span className="text-gray-900 font-bold capitalize">
                {session.user.preparationLevel?.toLowerCase() || "Beginner"} Level
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-400 text-xs uppercase tracking-widest">Participants</span>
              <span className="text-gray-900 font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> 127 Aspirants Today
              </span>
            </div>
          </div>

          {latestChallenge ? (
            <div className="flex flex-col items-center gap-3">
              <Link
                href={`/dashboard/challenges/${latestChallenge.slug}`}
                className="group inline-flex items-center justify-center gap-3 bg-primary text-white h-14 min-w-[260px] px-8 rounded-xl font-bold tracking-wider hover:bg-blue-600 transition-all duration-180 ease-out shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.35)] hover:translate-y-[-2px] active:translate-y-px"
              >
                START PRACTICING{" "}
                <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
              </Link>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Compete for rankings and improve your preparation score.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-500 font-medium">Practice Arena Ready</p>
              <Link
                href="#practice-challenges"
                className="group inline-flex items-center justify-center gap-3 bg-primary text-white h-14 min-w-[260px] px-8 rounded-xl font-bold tracking-wider hover:bg-blue-600 transition-all duration-180 ease-out shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.35)] hover:translate-y-[-2px] active:translate-y-px"
              >
                START PRACTICING{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-gray-400 font-medium">
                Compete for rankings and improve your preparation score.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* SECTION 2 - OPEN PRACTICE CHALLENGES (Left Column) */}
        <section id="practice-challenges" className="lg:col-span-8 space-y-6 scroll-mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                Open Practice{" "}
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-bold">
                  {activeChallenges.length}
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">Choose from available public challenges.</p>
            </div>
          </div>
          <ChallengeGridClient challenges={activeChallenges} />
        </section>

        {/* Right Column: History & Invites */}
        <div className="lg:col-span-4 space-y-10">
          {/* SECTION 3 - PRIVATE INVITES */}
          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Challenge With Friends
              </h2>
              <p className="text-xs text-gray-400 mt-1 mb-2">Join challenges using invite codes.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 max-h-[120px] flex flex-col justify-center shadow-sm hover:border-gray-300 transition-colors">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Invite Code"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
                <button className="shrink-0 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm">
                  Join
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 4 - CHALLENGE HISTORY */}
          {recentAttempts && recentAttempts.length > 0 && (
            <section>
              <ChallengeHistory attempts={recentAttempts} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
