/**
 * Loading state for profile page
 */
"use client";

import { FullPageLoading } from "@/components/shared/LoadingStates";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <FullPageLoading message="Loading profile..." />
    </div>
  );
}
