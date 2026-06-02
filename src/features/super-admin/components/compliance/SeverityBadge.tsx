/**
 * QuizArena — Compliance Severity Badge
 *
 * Institutional severity classification badge component.
 * Five-tier classification: LOW | MEDIUM | HIGH | CRITICAL | SEVERE
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import type { ComplianceSeverity } from "@/types/super-admin-compliance";

interface SeverityBadgeProps {
  severity: ComplianceSeverity;
  size?: "xs" | "sm" | "md";
  showLabel?: boolean;
  showDot?: boolean;
  className?: string;
}

const SEVERITY_CONFIG: Record<
  ComplianceSeverity,
  {
    label: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    dotClass: string;
    pulse: boolean;
  }
> = {
  LOW: {
    label: "LOW",
    colorClass: "text-slate-400",
    bgClass: "bg-slate-800/60",
    borderClass: "border-slate-700/50",
    dotClass: "bg-slate-500",
    pulse: false,
  },
  MEDIUM: {
    label: "MED",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-950/40",
    borderClass: "border-blue-800/40",
    dotClass: "bg-blue-400",
    pulse: false,
  },
  HIGH: {
    label: "HIGH",
    colorClass: "text-amber-400",
    bgClass: "bg-amber-950/40",
    borderClass: "border-amber-800/40",
    dotClass: "bg-amber-400",
    pulse: false,
  },
  CRITICAL: {
    label: "CRIT",
    colorClass: "text-orange-400",
    bgClass: "bg-orange-950/40",
    borderClass: "border-orange-800/40",
    dotClass: "bg-orange-400",
    pulse: true,
  },
  SEVERE: {
    label: "SEVERE",
    colorClass: "text-red-400",
    bgClass: "bg-red-950/40",
    borderClass: "border-red-800/40",
    dotClass: "bg-red-500",
    pulse: true,
  },
};

const SIZE_CLASSES = {
  xs: {
    badge: "px-1.5 py-0.5 text-[9px]",
    dot: "w-1 h-1",
  },
  sm: {
    badge: "px-2 py-0.5 text-[10px]",
    dot: "w-1.5 h-1.5",
  },
  md: {
    badge: "px-2.5 py-1 text-xs",
    dot: "w-2 h-2",
  },
};

export function SeverityBadge({
  severity,
  size = "sm",
  showLabel = true,
  showDot = true,
  className = "",
}: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity];
  const sizeClass = SIZE_CLASSES[size];

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded border ${config.bgClass} ${config.borderClass} ${config.colorClass} ${sizeClass.badge} ${className}`}
    >
      {showDot && (
        <span
          className={`rounded-full shrink-0 ${config.dotClass} ${sizeClass.dot} ${config.pulse ? "animate-pulse" : ""}`}
        />
      )}
      {showLabel && <span className="tracking-wider">{config.label}</span>}
    </span>
  );
}

/**
 * Full severity description block for forensic context panels.
 */
export function SeverityDescriptionBlock({ severity }: { severity: ComplianceSeverity }) {
  const descriptions: Record<ComplianceSeverity, string> = {
    LOW: "Routine governance activity — no immediate action required",
    MEDIUM: "Moderation escalation — monitor and review",
    HIGH: "Permission changes — verify actor authorization",
    CRITICAL: "Infrastructure override — immediate investigation recommended",
    SEVERE: "Sovereign governance action — full forensic review required",
  };

  const config = SEVERITY_CONFIG[severity];

  return (
    <div
      className={`flex items-start gap-2 p-2.5 rounded-lg border ${config.bgClass} ${config.borderClass}`}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${config.dotClass} ${config.pulse ? "animate-pulse" : ""}`}
      />
      <p className={`text-xs font-medium ${config.colorClass}`}>{descriptions[severity]}</p>
    </div>
  );
}
