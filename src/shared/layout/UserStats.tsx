import { Trophy, Flame } from "lucide-react";
import { AnalyticsService } from "@/features/analytics/services/analytics.service";

export async function UserStats({ userId }: { userId: string }) {
  const snapshot = await AnalyticsService.getPerformanceSnapshot(userId);

  const currentStreak = snapshot.currentStreak || 0;
  const currentRank = snapshot.currentRank || null;

  return (
    <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
      <span className="flex items-center whitespace-nowrap gap-1 px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded text-[10px] font-bold border border-orange-100">
        <Flame className="w-3 h-3 shrink-0" /> {currentStreak} Streak
      </span>
      <span className="flex items-center whitespace-nowrap gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100 truncate">
        <Trophy className="w-3 h-3 shrink-0" /> {currentRank ? `Rank #${currentRank}` : "Unranked"}
      </span>
    </div>
  );
}
