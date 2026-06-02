/**
 * QuizArena — Compliance Severity Utilities
 *
 * Maps DB audit severity + context to the 5-tier institutional
 * compliance severity classification system.
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import type {
  ComplianceSeverity,
  DbAuditSeverity,
  GovernanceCategory,
} from "@/types/super-admin-compliance";

// ─── Severity Mapping ─────────────────────────────────────────────────────────

/**
 * Map DB severity → compliance severity tier.
 * SEVERE is applied when a SUPER_ADMIN governance action is detected.
 */
export function mapToComplianceSeverity(
  dbSeverity: DbAuditSeverity,
  isSovereignAction: boolean
): ComplianceSeverity {
  if (isSovereignAction && (dbSeverity === "CRITICAL" || dbSeverity === "HIGH")) {
    return "SEVERE";
  }
  return dbSeverity as ComplianceSeverity;
}

/**
 * Detect if an audit action represents a sovereign SUPER_ADMIN governance operation.
 */
export function isSovereignAction(
  action: string,
  metadata: Record<string, unknown> | null
): boolean {
  if (!action) return false;

  const sovereignPatterns = [
    "SUPER_ADMIN",
    "HIGH_RISK_INITIATED",
    "HIGH_RISK_COMPLETED",
    "HIGH_RISK_BLOCKED",
    "PLATFORM_SHUTDOWN",
    "MAINTENANCE_MODE",
    "DATA_PURGE",
    "SUPER_ADMIN_DELEGATION",
    "INFRASTRUCTURE_CONFIG",
    "FINANCIAL_OVERRIDE",
    "MASS_ROLE_CHANGE",
    "COMPLIANCE_HUB_ACCESS",
    "GOVERNANCE_HUB_ACCESS",
    "SECURITY_CENTER_ACCESS",
  ];

  if (sovereignPatterns.some((p) => action.toUpperCase().includes(p))) {
    return true;
  }

  // Check metadata for actorRole = SUPER_ADMIN
  if (metadata && typeof metadata === "object") {
    const role = metadata.actorRole;
    if (role === "SUPER_ADMIN") return true;
  }

  return false;
}

// ─── Category Extraction ───────────────────────────────────────────────────────

/**
 * Extract governance category from action + metadata.
 */
export function extractGovernanceCategory(
  action: string,
  entityType: string,
  metadata: Record<string, unknown> | null
): GovernanceCategory {
  // Prefer metadata-declared category
  if (metadata?.category && typeof metadata.category === "string") {
    const cat = metadata.category as GovernanceCategory;
    const validCategories: GovernanceCategory[] = [
      "AUTHENTICATION",
      "ROLE_GOVERNANCE",
      "FINANCIAL_CONTROL",
      "INFRASTRUCTURE",
      "SECURITY",
      "COMPLIANCE",
      "PLATFORM_CONTROLS",
      "SESSION_MANAGEMENT",
      "HIGH_RISK_ACTION",
      "DATA_ACCESS",
      "MODERATION",
      "SETTINGS",
      "SYSTEM",
    ];
    if (validCategories.includes(cat)) return cat;
  }

  // Derive from entity type and action
  const upperAction = action.toUpperCase();
  const upperEntity = entityType.toUpperCase();

  if (
    upperAction.includes("AUTH") ||
    upperAction.includes("LOGIN") ||
    upperAction.includes("SESSION")
  )
    return "AUTHENTICATION";
  if (upperAction.includes("ROLE") || upperAction.includes("PRIVILEGE") || upperEntity === "ROLE")
    return "ROLE_GOVERNANCE";
  if (upperAction.includes("FINANCIAL") || upperEntity === "FINANCIAL") return "FINANCIAL_CONTROL";
  if (upperAction.includes("INFRASTRUCTURE") || upperAction.includes("INFRASTRUCTURE_CONFIG"))
    return "INFRASTRUCTURE";
  if (upperAction.includes("SECURITY") || upperEntity === "SECURITY") return "SECURITY";
  if (upperAction.includes("COMPLIANCE") || upperAction.includes("AUDIT")) return "COMPLIANCE";
  if (
    upperAction.includes("PLATFORM") ||
    upperAction.includes("FEATURE") ||
    upperAction.includes("SETTINGS")
  )
    return "PLATFORM_CONTROLS";
  if (upperAction.includes("MODERATION") || upperEntity === "MODERATION") return "MODERATION";
  if (upperEntity === "SETTINGS") return "SETTINGS";
  if (upperAction.includes("HIGH_RISK")) return "HIGH_RISK_ACTION";
  if (upperEntity === "SYSTEM") return "SYSTEM";

  return "UNKNOWN";
}

// ─── Time Utilities ───────────────────────────────────────────────────────────

/**
 * Compute a human-readable "time ago" string from a Date.
 * Server-computed to avoid hydration mismatches.
 */
export function computeTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Severity Display Config ─────────────────────────────────────────────────

export interface SeverityDisplayConfig {
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  dotClass: string;
  pulse: boolean;
  description: string;
}

export const SEVERITY_DISPLAY: Record<ComplianceSeverity, SeverityDisplayConfig> = {
  LOW: {
    label: "LOW",
    colorClass: "text-slate-400",
    bgClass: "bg-slate-800/60",
    borderClass: "border-slate-700/50",
    dotClass: "bg-slate-500",
    pulse: false,
    description: "Routine governance activity",
  },
  MEDIUM: {
    label: "MEDIUM",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-950/40",
    borderClass: "border-blue-800/40",
    dotClass: "bg-blue-400",
    pulse: false,
    description: "Moderation escalation",
  },
  HIGH: {
    label: "HIGH",
    colorClass: "text-amber-400",
    bgClass: "bg-amber-950/40",
    borderClass: "border-amber-800/40",
    dotClass: "bg-amber-400",
    pulse: false,
    description: "Permission changes",
  },
  CRITICAL: {
    label: "CRITICAL",
    colorClass: "text-orange-400",
    bgClass: "bg-orange-950/40",
    borderClass: "border-orange-800/40",
    dotClass: "bg-orange-400",
    pulse: true,
    description: "Infrastructure override",
  },
  SEVERE: {
    label: "SEVERE",
    colorClass: "text-red-400",
    bgClass: "bg-red-950/40",
    borderClass: "border-red-800/40",
    dotClass: "bg-red-500",
    pulse: true,
    description: "Sovereign governance action",
  },
};

// ─── Security Event Classification ────────────────────────────────────────────

import type { SecurityEventType } from "@/types/super-admin-compliance";

export function classifySecurityEventType(action: string): SecurityEventType {
  const upper = action.toUpperCase();

  if (upper.includes("AUTH") || upper.includes("LOGIN") || upper.includes("FAILED"))
    return "AUTH_FAILURE";
  if (upper.includes("ROLE_CHANGE") || upper.includes("PRIVILEGE")) return "ROLE_ESCALATION";
  if (upper.includes("UNAUTHORIZED") || upper.includes("DENIED")) return "UNAUTHORIZED_ACCESS";
  if (upper.includes("INFRASTRUCTURE") || upper.includes("INFRASTRUCTURE_CONFIG"))
    return "INFRASTRUCTURE_OVERRIDE";
  if (upper.includes("SESSION") || upper.includes("STALE")) return "SESSION_ANOMALY";
  if (upper.includes("PERMISSION")) return "PERMISSION_FAILURE";
  if (upper.includes("GOVERNANCE") || upper.includes("BREACH")) return "GOVERNANCE_BREACH";
  if (upper.includes("HIGH_RISK_BLOCKED")) return "HIGH_RISK_BLOCKED";
  if (upper.includes("HIGH_RISK_INITIATED") || upper.includes("HIGH_RISK_COMPLETED"))
    return "CRITICAL_OPERATION";
  if (upper.includes("SUSPICIOUS") || upper.includes("ANOMAL")) return "SUSPICIOUS_PATTERN";

  return "CRITICAL_OPERATION";
}
