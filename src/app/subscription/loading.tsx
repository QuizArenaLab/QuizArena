/**
 * Loading state for subscription (placeholder)
 */
"use client";

import { FullPageLoading } from '@/shared/loading/LoadingStates';

export default function SubscriptionLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <FullPageLoading message="Loading subscription..." />
    </div>
  );
}
