/**
 * Loading state for leaderboard (placeholder)
 */
"use client";

import { FullPageLoading } from "@/shared/components/LoadingStates";

export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <FullPageLoading message="Loading leaderboard..." />
    </div>
  );
}
