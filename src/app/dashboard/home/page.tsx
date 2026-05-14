/**
 * QuizArena — Dashboard Home View
 *
 * Overview of user progress, upcoming challenges, and quick actions.
 */
import { Trophy, Clock, Target, ArrowRight, Play, BookOpen } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function DashboardHomePage() {
  const stats = [
    { label: "Tests Taken", value: "12", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Avg. Score", value: "84%", icon: Target, color: "text-green-600", bg: "bg-green-50" },
    {
      label: "Study Streak",
      value: "5 Days",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    { label: "Points", value: "1,250", icon: Trophy, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-navy rounded-2xl p-8 sm:p-12 text-white">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl font-bold mb-4">Ready to crush your next exam?</h1>
          <p className="text-white/70 mb-8">
            Your personalized study plan is ready. Pick up where you left off or start a new
            challenge.
          </p>
          <Link
            href={ROUTES.PROTECTED.CHALLENGES}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            Start New Quiz
          </Link>
        </div>

        {/* Abstract background shape */}
        <div className="absolute right-0 top-0 h-full w-1/2 bg-linear-to-l from-primary/20 to-transparent pointer-events-none" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div
              className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-navy">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy">Recent Activity</h2>
            <Link href="#" className="text-sm font-semibold text-primary flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="px-6 py-4 flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-navy font-bold">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">AWS Cloud Practitioner</p>
                    <p className="text-xs text-gray-500">Practice Test • Completed yesterday</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">88%</p>
                  <p className="text-xs text-gray-400">Passed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-navy">Next Steps</h2>
          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
            <h3 className="font-bold mb-2">Upgrade to Pro</h3>
            <p className="text-sm text-white/80 mb-6">
              Unlock unlimited practice tests and AI explanations for all certifications.
            </p>
            <Link
              href={ROUTES.PROTECTED.SUBSCRIPTION}
              className="block w-full text-center bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors text-sm"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
