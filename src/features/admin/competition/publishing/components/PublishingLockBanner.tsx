"use client";

import { usePublishingStore } from "../hooks/usePublishingStore";
import { Lock } from "lucide-react";

interface PublishingLockBannerProps {
  currentUserId: string;
}

export function PublishingLockBanner({ currentUserId }: PublishingLockBannerProps) {
  const lock = usePublishingStore((s) => s.publishingLock);

  if (!lock || lock.userId === currentUserId) return null;

  return (
    <div className="bg-red-500 text-white px-4 py-2 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 font-bold text-sm">
        <Lock className="w-4 h-4" />
        Publishing in Progress
      </div>
      <div className="text-xs font-medium">
        {lock.userName} is currently publishing this competition. Actions are disabled until they
        finish.
      </div>
    </div>
  );
}
