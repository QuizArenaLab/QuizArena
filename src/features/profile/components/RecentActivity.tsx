import { Clock, Trophy, Target, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      title: "Completed SSC National Sprint #12",
      metric: "Rank #41",
      time: "2 days ago",
      icon: Trophy,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      id: 2,
      title: "Completed Quant Practice",
      metric: "Accuracy 78%",
      time: "Yesterday",
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: 3,
      title: "Unlocked First Challenge Badge",
      metric: "Achievement Unlocked",
      time: "3 days ago",
      icon: Award,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      id: 4,
      title: "Started 5-Day Streak",
      metric: "Consistency",
      time: "4 days ago",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between text-gray-500">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-700">
            Recent Activity
          </h2>
        </div>
        <Link
          href="#"
          className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
        >
          View Full <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="p-6 sm:p-8">
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-0 md:before:translate-x-5 before:h-full before:w-[2px] before:bg-gray-100">
          {activities.map((item, index) => (
            <div key={item.id} className="relative flex items-start gap-4 z-10 group">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${item.bg} ${item.color} shrink-0 shadow-xs group-hover:scale-110 transition-transform ring-4 ring-white`}
              >
                <item.icon className="w-4 h-4" />
              </div>
              <div className="pt-1 flex-1 bg-white">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-1">
                  <h3 className="text-sm font-bold text-navy">{item.title}</h3>
                  <span className="text-xs font-semibold text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-0.5 rounded-md">
                    {item.time}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{item.metric}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 sm:hidden">
          <Link
            href="#"
            className="flex items-center justify-center w-full gap-2 px-5 py-3 rounded-xl bg-gray-50 text-sm font-bold text-primary hover:bg-gray-100 transition-colors"
          >
            View Full Activity <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
