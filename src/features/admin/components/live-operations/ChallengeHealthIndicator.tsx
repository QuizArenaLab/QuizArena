import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import type { ChallengeHealthState } from "@/types/live-operations";

interface ChallengeHealthIndicatorProps {
  healthState: ChallengeHealthState;
  className?: string;
}

export function ChallengeHealthIndicator({
  healthState,
  className = "",
}: ChallengeHealthIndicatorProps) {
  switch (healthState) {
    case "CRITICAL":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 animate-pulse ${className}`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          CRITICAL
        </span>
      );
    case "DEGRADED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          DEGRADED
        </span>
      );
    case "WARNING":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          WARNING
        </span>
      );
    case "HEALTHY":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200 ${className}`}
        >
          <div className="w-2 h-2 rounded-full bg-green-500" />
          HEALTHY
        </span>
      );
  }
}
