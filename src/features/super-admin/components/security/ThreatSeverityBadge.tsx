"use client";

import type { ThreatSeverity, ThreatSeverityDisplayConfig } from "@/types/super-admin-security";
import { THREAT_SEVERITY_DISPLAY } from "@/types/super-admin-security";

interface ThreatSeverityBadgeProps {
  severity: ThreatSeverity;
  size?: "xs" | "sm" | "md";
  showDot?: boolean;
  showDescription?: boolean;
}

export function ThreatSeverityBadge({
  severity,
  size = "sm",
  showDot = true,
  showDescription = false,
}: ThreatSeverityBadgeProps) {
  const config: ThreatSeverityDisplayConfig = THREAT_SEVERITY_DISPLAY[severity];

  const sizeClasses = {
    xs: "text-[9px] px-1.5 py-0.5",
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  const dotSizes = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold tracking-wider uppercase rounded-full border ${config.bgClass} ${config.borderClass} ${config.colorClass} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span
          className={`rounded-full shrink-0 ${dotSizes[size]} ${config.dotClass} ${config.pulse ? "animate-pulse" : ""}`}
        />
      )}
      {config.label}
      {showDescription && (
        <span className="font-normal normal-case tracking-normal opacity-70 text-[9px] ml-0.5">
          — {config.description}
        </span>
      )}
    </span>
  );
}
