/**
 * Loading state for onboarding pages
 */
"use client";

import { FullPageLoading } from "@/components/shared/LoadingStates";

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <FullPageLoading message="Preparing onboarding..." />
    </div>
  );
}
