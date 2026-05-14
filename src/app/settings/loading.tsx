/**
 * Loading state for settings page
 */
"use client";

import { FullPageLoading } from "@/components/shared/LoadingStates";

export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <FullPageLoading message="Loading settings..." />
    </div>
  );
}
