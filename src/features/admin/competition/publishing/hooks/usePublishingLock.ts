import { useEffect } from "react";
import { usePublishingStore } from "./usePublishingStore";
import { PublishingLockInfo } from "../publishing/types/publishing.types";
// In a real implementation, this hook would periodically ping an endpoint to keep the lock alive,
// or use a WebSocket. For this mockup, it just manages the local state.

export function usePublishingLock(initialLock: PublishingLockInfo | null, currentUserId: string) {
  const setPublishingLock = usePublishingStore((s) => s.setPublishingLock);
  const lock = usePublishingStore((s) => s.publishingLock);

  useEffect(() => {
    setPublishingLock(initialLock);
  }, [initialLock, setPublishingLock]);

  const isLockedByOther = lock !== null && lock.userId !== currentUserId;

  return {
    lock,
    isLockedByOther,
  };
}
