import { Shield, Medal, Star, Flame, Flag, Trophy, Lock } from "lucide-react";

export function BadgeCollection() {
  const badges = [
    {
      id: "early_adopter",
      name: "Early Adopter",
      description: "Joined QuizArena during the early beta phase.",
      icon: Flag,
      unlocked: true,
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-200",
      shadow: "shadow-purple-100/50",
    },
    {
      id: "consistency",
      name: "Consistency Badge",
      description: "Logged in and practiced for 7 consecutive days.",
      icon: Flame,
      unlocked: true,
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-200",
      shadow: "shadow-orange-100/50",
    },
    {
      id: "top_performer",
      name: "Top Performer",
      description: "Achieved Top 10% in a national competition.",
      icon: Star,
      unlocked: false,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      border: "border-yellow-200",
      requirement: "Reach Top 10 Percentile.",
    },
    {
      id: "competition_winner",
      name: "Competition Winner",
      description: "Secured Rank #1 in a national competition.",
      icon: Trophy,
      unlocked: false,
      color: "text-amber-600",
      bg: "bg-amber-100",
      border: "border-amber-200",
      requirement: "Win a national competition.",
    },
    {
      id: "founding_aspirant",
      name: "Founding Aspirant",
      description: "Part of the first 1000 users.",
      icon: Shield,
      unlocked: true,
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-200",
      shadow: "shadow-blue-100/50",
    },
    {
      id: "national_competitor",
      name: "National Competitor",
      description: "Participated in a national level event.",
      icon: Medal,
      unlocked: false,
      color: "text-red-600",
      bg: "bg-red-100",
      border: "border-red-200",
      requirement: "Join a national sprint.",
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 text-gray-500">
        <Shield className="w-4 h-4 text-gray-400" />
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-700">
          Badge Collection
        </h2>
        <span className="text-gray-300 mx-1">•</span>
        <p className="text-[11px] font-medium text-gray-400">3 of 12 unlocked</p>
      </div>

      <div className="p-6 sm:p-8 flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`group relative flex flex-col items-center text-center p-4 rounded-2xl border ${
              badge.unlocked
                ? `${badge.border} bg-white shadow-[0_0_15px_rgba(0,0,0,0.05)] shadow-${badge.color.split("-")[1]}-500/10 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] transition-all cursor-pointer`
                : "border-gray-100 bg-gray-50/50 opacity-60 grayscale hover:opacity-100 transition-opacity"
            }`}
          >
            {!badge.unlocked && (
              <div className="absolute top-2 right-2 text-gray-300">
                <Lock className="w-3 h-3" />
              </div>
            )}
            <div
              className={`p-3 rounded-full ${badge.bg} ${badge.color} mb-3 ${!badge.unlocked ? "bg-gray-100 text-gray-400" : ""}`}
            >
              <badge.icon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-navy mb-1">{badge.name}</h3>

            <div className="mt-auto">
              {badge.unlocked ? (
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                  Earned
                </span>
              ) : (
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-full">
                  Locked
                </span>
              )}
            </div>

            {/* Description Tooltip */}
            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-navy text-white text-xs rounded-xl p-3 shadow-xl transition-opacity pointer-events-none z-10">
              <p className="font-semibold mb-1">{badge.name}</p>
              <p className="text-gray-300 mb-1 leading-tight">{badge.description}</p>
              {!badge.unlocked && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <p className="text-orange-300 font-medium mb-1">Req: {badge.requirement}</p>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div className="bg-orange-400 h-1 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                </div>
              )}
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
