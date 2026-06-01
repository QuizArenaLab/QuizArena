import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { getLatestChallenge, getActiveChallenges } from "@/actions/challenge";
import { getPerformanceOverview, getRecentAttempts, getAnalyticsIntelligence } from "@/actions/performance";
import Link from "next/link";
import { Trophy, Target, Clock, Zap, CheckCircle2, TrendingUp, AlertTriangle, ChevronRight, Activity, Flame, Medal, Lightbulb, Map } from "lucide-react";
import { RecommendedChallengeCTA } from "@/components/arena/RecommendedChallengeCTA";
import { EXAM_CATEGORY_LABELS } from "@/lib/onboarding";
import { prisma } from "@/lib/prisma";
import { AttemptStatus } from "@/generated/prisma";

export default async function PracticeArenaPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const userId = session.user.id;
  const [
    latestChallenge, 
    activeChallenges, 
    recentAttempts, 
    performance, 
    intelligence,
    todayAttempts
  ] = await Promise.all([
    getLatestChallenge(),
    getActiveChallenges(),
    getRecentAttempts(userId, 5),
    getPerformanceOverview(userId),
    getAnalyticsIntelligence(userId),
    prisma.attempt.findMany({
      where: {
        userId,
        status: AttemptStatus.EVALUATED,
        submittedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      select: {
        score: true,
        correctAnswers: true,
        totalAnswered: true,
        timeTakenInSeconds: true,
      }
    })
  ]);

  const hasHistory = performance && performance.totalAttempts > 0;
  
  // Determine Target Challenge
  let recommendedChallenge = null;
  if (intelligence.weakness && intelligence.weakness.weakestCategory) {
    recommendedChallenge = activeChallenges.find(c => c.category === intelligence.weakness!.weakestCategory) || latestChallenge;
  } else if (hasHistory && performance?.weakestCategory) {
    recommendedChallenge = activeChallenges.find(c => c.category === performance.weakestCategory) || latestChallenge;
  } else {
    recommendedChallenge = latestChallenge;
  }

  // Calculate Today's Progress
  let todayMinutes = 0;
  let todayCorrect = 0;
  let todayAnswered = 0;
  let todayScore = 0;

  todayAttempts.forEach(a => {
    todayMinutes += Math.floor((a.timeTakenInSeconds || 0) / 60);
    todayCorrect += a.correctAnswers;
    todayAnswered += a.totalAnswered;
    todayScore += a.score;
  });

  const todayAccuracy = todayAnswered > 0 ? Math.round((todayCorrect / todayAnswered) * 100) : 0;
  const todayAvgScore = todayAttempts.length > 0 ? Math.round(todayScore / todayAttempts.length) : 0;

  // Build Training Plan (Top 3 Priorities)
  const trainingPlan: Array<{category: string, label: string}> = [];
  if (hasHistory) {
    if (intelligence.weakness) {
      trainingPlan.push({ category: intelligence.weakness.weakestCategory, label: "Core Weakness" });
    }
    intelligence.actions.forEach(action => {
      if (trainingPlan.length < 3 && !trainingPlan.find(p => p.category === action.category)) {
        trainingPlan.push({ category: action.category, label: action.type === 'speed' ? 'Speed Drills' : 'Practice' });
      }
    });
    while (trainingPlan.length < 3 && activeChallenges.length > trainingPlan.length) {
      const fallback = activeChallenges[trainingPlan.length]?.category || "GENERAL";
      if (!trainingPlan.find(p => p.category === fallback)) {
        trainingPlan.push({ category: fallback, label: "General Practice" });
      } else {
        break;
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 -m-6 sm:-m-8 p-6 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
      
      {/* SECTION 1 - PRACTICE SESSION HERO */}
      <section className="relative rounded-2xl overflow-hidden bg-navy text-white shadow-lg flex flex-col justify-center py-8 md:py-12 px-8 md:px-12 border border-gray-800">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-size-[24px_24px] opacity-20"></div>
          <div
            className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-md uppercase tracking-widest">
                <Activity className="w-3.5 h-3.5 text-blue-400" /> PRACTICE SESSION
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-md uppercase tracking-widest">
                {intelligence.maturityLevel === 0 ? "Beginner" : intelligence.maturityLevel === 1 ? "Novice" : "Intermediate"}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-white">
              Today&apos;s Training Focus
            </h1>
            <p className="text-gray-400 font-medium text-lg mb-8">
              {hasHistory 
                ? "Continue improving your preparation performance by tackling targeted weaknesses."
                : "Complete your first session and QuizArena will build your personalized training roadmap."
              }
            </p>
            
            {hasHistory && recommendedChallenge && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium mb-3">
                  <span className="px-2.5 py-1 bg-primary/20 text-blue-300 text-xs font-bold rounded-md uppercase tracking-wider">
                    {recommendedChallenge.category ? EXAM_CATEGORY_LABELS[recommendedChallenge.category as keyof typeof EXAM_CATEGORY_LABELS] || recommendedChallenge.category : "Balanced Practice"}
                  </span>
                  <span className="px-2.5 py-1 bg-white/10 text-gray-300 text-xs font-bold rounded-md uppercase tracking-wider">
                    {recommendedChallenge.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{recommendedChallenge.title}</h3>
                <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-400" /> Target: 75%
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" /> {recommendedChallenge.durationInMinutes} Minutes
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" /> {recommendedChallenge.totalQuestions} Questions
                  </div>
                </div>
              </div>
            )}

            {!hasHistory && (
               <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 backdrop-blur-sm flex items-start gap-3">
                 <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                 <p className="text-sm font-medium text-gray-300 leading-relaxed">
                   <strong>Training Momentum:</strong> Complete your first session to activate preparation tracking.
                 </p>
               </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {recommendedChallenge ? (
                <RecommendedChallengeCTA challenge={recommendedChallenge} label={hasHistory ? "Begin Training Session" : "Start Assessment Session"} />
              ) : (
                <button disabled className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-700 text-gray-400 h-12 px-8 rounded-xl font-bold">
                  Generate Training Plan
                </button>
              )}
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col justify-center items-end">
             {/* Decorative element reduced in size by ~40% */}
             <div className="w-40 h-40 border-8 border-white/5 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/30 to-transparent rounded-full blur-xl"></div>
                <Trophy className="w-14 h-14 text-white/20" />
             </div>
          </div>
        </div>
      </section>

      {/* TWO COLUMNS: LEFT (COMPASS, PLAN, SESSIONS) | RIGHT (COACH, PROGRESS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 2 - PERFORMANCE COMPASS */}
          <section>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Map className="w-4 h-4 text-primary" /> Performance Compass
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Strongest Area</span>
                </div>
                {hasHistory ? (
                  <>
                    <div className="font-bold text-gray-900 truncate">
                      {performance?.strongestCategory ? (EXAM_CATEGORY_LABELS[performance.strongestCategory as keyof typeof EXAM_CATEGORY_LABELS] || performance.strongestCategory) : "—"}
                    </div>
                    <div className="text-2xl font-black text-gray-900 mt-1">
                      {intelligence.categories.find(c => c.category === performance?.strongestCategory)?.accuracy || 0}%
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-gray-400 text-sm mt-1">Not Available Yet</div>
                  </>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm border-l-4 border-l-red-500">
                <div className="flex items-center gap-2 text-red-500 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Needs Improvement</span>
                </div>
                {hasHistory ? (
                  <>
                    <div className="font-bold text-gray-900 truncate">
                      {intelligence.weakness?.weakestCategory ? (EXAM_CATEGORY_LABELS[intelligence.weakness.weakestCategory as keyof typeof EXAM_CATEGORY_LABELS] || intelligence.weakness.weakestCategory) : (performance?.weakestCategory ? (EXAM_CATEGORY_LABELS[performance.weakestCategory as keyof typeof EXAM_CATEGORY_LABELS] || performance.weakestCategory) : "—")}
                    </div>
                    <div className="text-2xl font-black text-gray-900 mt-1">
                      {intelligence.weakness?.categoryAccuracy || (intelligence.categories.find(c => c.category === performance?.weakestCategory)?.accuracy || 0)}%
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-gray-400 text-sm mt-1">Awaiting Analysis</div>
                  </>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 p-5 shadow-sm bg-blue-50/50">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Current Accuracy</span>
                </div>
                {hasHistory ? (
                  <>
                    <div className="font-bold text-gray-600 truncate">Overall Average</div>
                    <div className="text-2xl font-black text-blue-700 mt-1">
                      {Math.round(performance?.averageAccuracy || 0)}%
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-gray-500 text-sm mt-1">Complete First Session</div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 3 - TODAY'S TRAINING PLAN */}
          <section>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
              Today&apos;s Training Plan
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              {hasHistory && trainingPlan.length > 0 ? (
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100"></div>
                  
                  <div className="space-y-6">
                    {trainingPlan.map((step, idx) => {
                      const isCompleted = todayAttempts.length > idx;
                      const isInProgress = todayAttempts.length === idx;
                      
                      return (
                        <div key={idx} className="relative flex items-center gap-6">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 shrink-0 border-2 ${
                            isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 
                            isInProgress ? 'bg-white border-primary text-primary' : 
                            'bg-white border-gray-200 text-gray-400'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{idx + 1}</span>}
                          </div>
                          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-4 flex justify-between items-center">
                            <div>
                              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{step.label}</div>
                              <div className={`font-bold ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                {EXAM_CATEGORY_LABELS[step.category as keyof typeof EXAM_CATEGORY_LABELS] || step.category}
                              </div>
                            </div>
                            <div className={`text-xs font-bold uppercase tracking-wider ${
                              isCompleted ? 'text-emerald-600' : 
                              isInProgress ? 'text-primary' : 
                              'text-gray-400'
                            }`}>
                              {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Pending'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm font-medium mb-4">No plan generated yet</p>
                  {recommendedChallenge && (
                    <RecommendedChallengeCTA challenge={recommendedChallenge} label="Generate Plan" />
                  )}
                </div>
              )}
            </div>
          </section>

          {/* SECTION 5 - RECENT TRAINING SESSIONS */}
          <section>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
              Recent Sessions
            </h2>
            {recentAttempts && recentAttempts.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {recentAttempts.map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 mb-1">{attempt.challengeName}</div>
                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                           <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5"/> {attempt.accuracy}% Acc</span>
                           <span>{attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleDateString() : "—"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md uppercase tracking-wider hidden sm:block">
                          Completed
                        </span>
                        <Link href={`/dashboard/results/${attempt.id}`} className="p-2 text-gray-400 hover:text-primary transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
                <Activity className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-gray-900 mb-1">No Sessions Yet</h3>
              </div>
            )}
          </section>
          
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* SECTION 6 - PREPARATION COACH */}
          <section>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Preparation Coach
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-amber-50 to-transparent opacity-50 pointer-events-none" />
               {intelligence.actions && intelligence.actions.length > 0 && hasHistory ? (
                 <div className="relative z-10">
                    <div className="text-sm font-bold text-amber-600 mb-2 uppercase tracking-wider">Coach Insight</div>
                    <h3 className="text-lg font-black text-gray-900 mb-3">{intelligence.actions[0].title}</h3>
                    <p className="text-gray-600 text-sm font-medium mb-4 leading-relaxed">
                      {intelligence.actions[0].reason}
                    </p>
                    <div className="bg-amber-50 text-amber-800 text-xs font-bold px-3 py-2 rounded-lg inline-flex items-center gap-2">
                       <TrendingUp className="w-3.5 h-3.5" />
                       Expected Impact: {intelligence.actions[0].expectedImpact}
                    </div>
                 </div>
               ) : (
                 <div className="relative z-10 text-left py-2">
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                      Your personalized recommendations will appear after your first training session. The more you practice, the smarter your preparation roadmap becomes.
                    </p>
                 </div>
               )}
            </div>
          </section>

          {/* SECTION 4 - SESSION PROGRESS (UNIFIED) */}
          <section>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">
              Session Progress
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Challenges Today</span>
                <span className="text-lg font-black text-gray-900">{todayAttempts.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Practice Minutes</span>
                <span className="text-lg font-black text-gray-900">{todayMinutes}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Focus Score</span>
                <span className="text-lg font-black text-gray-900">{todayAvgScore}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Today&apos;s Accuracy</span>
                <span className="text-lg font-black text-gray-900">{todayAccuracy}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" /> Current Streak
                </span>
                <span className="text-lg font-black text-gray-900">{performance?.currentStreak || 0} Days</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
