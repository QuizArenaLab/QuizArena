/**
 * QuizArena — SOC Master Aggregator
 *
 * Orchestrates all SOC sub-systems via Promise.all() parallelism.
 * ALL security intelligence is server-authoritative.
 * Client receives pre-computed, serialized SOCPageData only.
 *
 * Phase 7.7: Security Operations Center
 */

import type { SOCPageData, SOCFilter } from "@/types/super-admin-security";
import { getSecurityOverview } from "./overview";
import { investigateAuthFailures } from "./auth-forensics";
import { detectPrivilegeEscalation } from "./privilege-escalation";
import { getThreatTimeline } from "./threat-timeline";
import { detectSuspiciousActivity } from "./suspicious-activity";
import { monitorPrivilegedSessions } from "./session-governance";
import { getSecurityAlerts } from "./alerts";

/**
 * Master SOC aggregator — orchestrates all security sub-systems in parallel.
 * Returns fully server-computed SOCPageData.
 *
 * Performance: All 7 sub-systems run concurrently via Promise.all().
 */
export async function getSOCPageData(filter?: SOCFilter): Promise<SOCPageData> {
  const [
    overview,
    alerts,
    authForensics,
    privilegeEscalation,
    threatTimeline,
    suspiciousActivity,
    sessionGovernance,
  ] = await Promise.all([
    getSecurityOverview(),
    getSecurityAlerts(),
    investigateAuthFailures(),
    detectPrivilegeEscalation(),
    getThreatTimeline(filter),
    detectSuspiciousActivity(),
    monitorPrivilegedSessions(),
  ]);

  const now = new Date();

  return {
    overview,
    alerts,
    authForensics,
    privilegeEscalation,
    threatTimeline,
    suspiciousActivity,
    sessionGovernance,
    lastAggregatedISO: now.toISOString(),
  };
}

// Re-export individual functions for targeted use
export { getSecurityOverview } from "./overview";
export { investigateAuthFailures } from "./auth-forensics";
export { detectPrivilegeEscalation } from "./privilege-escalation";
export { getThreatTimeline } from "./threat-timeline";
export { detectSuspiciousActivity } from "./suspicious-activity";
export { monitorPrivilegedSessions } from "./session-governance";
export { getSecurityAlerts } from "./alerts";
