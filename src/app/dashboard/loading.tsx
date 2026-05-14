/**
 * Dashboard Loading State
 *
 * Shown while the server verifies authentication
 * and prepares the dashboard. Prevents content flash.
 */
"use client";

import { FullPageLoading } from "@/components/shared/LoadingStates";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <FullPageLoading message="Preparing your dashboard..." />
    </div>
  );
}
