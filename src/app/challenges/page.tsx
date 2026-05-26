/**
 * QuizArena — Challenges Page
 *
 * Daily challenge listing with proper empty state.
 * Protected route — requires authentication.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { EXAM_CATEGORY_LABELS } from "@/lib/onboarding";
import { getLatestChallenge } from "@/actions/challenge";
import Link from "next/link";
import { Trophy, Target, Clock, ArrowRight, Play, Search, Filter, Zap } from "lucide-react";

export default async function ChallengesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const user = session.user;
  const category = user.category as keyof typeof EXAM_CATEGORY_LABELS | undefined;
  const challenge = await getLatestChallenge();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "bg-green-100 text-green-700";
      case "MEDIUM":
        return "bg-amber-100 text-amber-700";
      case "HARDCORE":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-2">Challenges</h1>
          <p className="text-gray-500">Test your knowledge with competitive quizzes</p>
        </div>
      </div>

      {challenge ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-navy/90 rounded-2xl p-6 sm:p-8 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full">
                <Zap className="w-3 h-3" />
                Today&apos;s Challenge
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(challenge.difficulty)}`}
              >
                {challenge.difficulty}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{challenge.title}</h2>
            <p className="text-white/70 mb-6 max-w-xl">
              {challenge.description ||
                `Test your skills with ${challenge.totalQuestions} questions in ${challenge.durationInMinutes} minutes.`}
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                {challenge.totalQuestions} Questions
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {challenge.durationInMinutes} Minutes
              </span>
              {challenge.category && (
                <span className="px-2 py-1 bg-white/10 rounded text-xs">
                  {EXAM_CATEGORY_LABELS[challenge.category as keyof typeof EXAM_CATEGORY_LABELS]}
                </span>
              )}
            </div>
            <Link
              href={`/dashboard/challenges/${challenge.slug}`}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Challenge
            </Link>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden bg-navy rounded-2xl p-6 sm:p-8 text-white">
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {category
                ? `Prepare for ${EXAM_CATEGORY_LABELS[category]}`
                : "Start Your Practice Journey"}
            </h2>
            <p className="text-white/70 mb-6 max-w-xl">
              {category
                ? `Based on your ${user.preparationLevel} level, we've curated challenges to help you succeed.`
                : "Complete your profile to get personalized quiz recommendations."}
            </p>
            <Link
              href={category ? "#" : "/profile"}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              {category ? "Start Challenge" : "Complete Profile"}
            </Link>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
        </div>
      )}

      {challenge && (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search challenges..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-navy placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl text-navy font-medium hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
              All
            </button>
            {category && (
              <button className="px-4 py-2 bg-white border border-gray-200 text-navy rounded-full text-sm font-medium hover:border-primary/30 transition-colors">
                {EXAM_CATEGORY_LABELS[category]}
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                <Trophy className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">More challenges coming soon</h3>
              <p className="text-gray-500 max-w-md mb-6">
                Check back regularly for new challenges across different topics and difficulty
                levels.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>New challenges added weekly</span>
              </div>
            </div>
          </div>
        </>
      )}

      {!challenge && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
              <Trophy className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-3">No challenges available yet</h3>
            <p className="text-gray-500 max-w-md mb-6">
              {category
                ? `We're curating ${EXAM_CATEGORY_LABELS[category]} challenges for your preparation level. Check back soon!`
                : "We're preparing personalized challenges for you. Complete your profile to get started."}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {category ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>New challenges added weekly</span>
                </div>
              ) : (
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                >
                  Complete your profile <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-navy mb-2">Topic-Based Quizzes</h3>
          <p className="text-sm text-gray-500">Practice specific topics and subjects</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-navy mb-2">Competitive Rankings</h3>
          <p className="text-sm text-gray-500">Compete with other aspirants</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-navy mb-2">Timed Challenges</h3>
          <p className="text-sm text-gray-500">Test your speed and accuracy</p>
        </div>
      </div>
    </div>
  );
}
