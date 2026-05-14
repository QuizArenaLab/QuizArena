/**
 * Loading state for analytics (placeholder)
 */
"use client";

import { FullPageLoading } from "@/components/shared/LoadingStates";

export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <FullPageLoading message="Loading analytics..." />
    </div>
  );
}
