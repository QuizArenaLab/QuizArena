"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function DashboardPoller({ intervalMs = 30000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [router, intervalMs]);

  return null;
}
