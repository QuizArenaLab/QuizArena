/**
 * QuizArena — Compliance Page Master Aggregator
 *
 * Orchestrates all compliance sub-systems into a single
 * server-authoritative data fetch using Promise.all() parallelism.
 *
 * ALL governance intelligence remains server-side.
 * Client receives pre-computed, serialized data only.
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import type { CompliancePageData, ComplianceFilter } from "@/types/super-admin-compliance";
import { getComplianceOverview } from "./overview";
import { getGovernanceTimeline } from "./timeline";
import { getSecurityForensics } from "./forensics";
import { detectGovernanceAnomalies } from "./anomalies";
import { getRecentRoleChanges, getRecentSettingAudits } from "./role-forensics";

/**
 * Master compliance aggregator — calls all sub-systems in parallel.
 * Returns fully server-computed CompliancePageData.
 */
export async function getCompliancePageData(
  filter?: ComplianceFilter
): Promise<CompliancePageData> {
  const [overview, timeline, securityForensics, anomalies, recentRoleChanges, recentSettingAudits] =
    await Promise.all([
      getComplianceOverview(),
      getGovernanceTimeline(filter),
      getSecurityForensics(),
      detectGovernanceAnomalies(),
      getRecentRoleChanges(8),
      getRecentSettingAudits(8),
    ]);

  const now = new Date();

  return {
    overview,
    timeline,
    securityForensics,
    anomalies,
    recentRoleChanges,
    recentSettingAudits,
    lastAggregated: now,
    lastAggregatedISO: now.toISOString(),
  };
}

// Re-export individual functions for targeted use
export { getComplianceOverview } from "./overview";
export { getGovernanceTimeline } from "./timeline";
export { getSecurityForensics } from "./forensics";
export { detectGovernanceAnomalies } from "./anomalies";
export { getRecentRoleChanges, getRecentSettingAudits } from "./role-forensics";
export { mapToComplianceSeverity, computeTimeAgo, SEVERITY_DISPLAY } from "./utils";
export type { SeverityDisplayConfig } from "./utils";
