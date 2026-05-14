/**
 * Loading state for challenges (placeholder)
 */
"use client";

import { FullPageLoading } from "@/components/shared/LoadingStates";

export default function ChallengesLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <FullPageLoading message="Loading challenges..." />
    </div>
  );
}
