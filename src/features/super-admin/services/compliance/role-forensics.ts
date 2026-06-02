/**
 * QuizArena — Role & Setting Change Forensics
 *
 * Specialized forensic queries for:
 * - RoleChangeAudit forensic entries
 * - SettingAudit forensic entries
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import { prisma } from "@/lib/prisma";
import type {
  RoleChangeForensicEntry,
  SettingAuditForensicEntry,
  GovernanceActorIdentity,
  GovernanceTargetIdentity,
  ComplianceSeverity,
} from "@/types/super-admin-compliance";
import { computeTimeAgo } from "./utils";

function getRoleChangeSeverity(newRole: string): ComplianceSeverity {
  if (newRole === "SUPER_ADMIN") return "SEVERE";
  if (newRole === "ADMIN") return "CRITICAL";
  if (newRole === "MODERATOR") return "HIGH";
  return "MEDIUM";
}

export async function getRecentRoleChanges(limit = 10): Promise<RoleChangeForensicEntry[]> {
  const changes = await prisma.roleChangeAudit.findMany({
    orderBy: { changedAt: "desc" },
    take: limit,
    include: {
      targetUser: {
        select: { id: true, name: true, email: true },
      },
      changedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  return changes.map((change) => {
    const actor: GovernanceActorIdentity = {
      id: change.changedBy.id,
      name: change.changedBy.name,
      email: change.changedBy.email,
      role: change.changedBy.role,
    };

    const target: GovernanceTargetIdentity = {
      id: change.targetUser.id,
      name: change.targetUser.name,
      email: change.targetUser.email,
    };

    return {
      id: change.id,
      actor,
      target,
      previousRole: change.previousRole,
      newRole: change.newRole,
      reason: change.reason,
      severity: getRoleChangeSeverity(change.newRole),
      timestamp: change.changedAt,
      timestampISO: change.changedAt.toISOString(),
      timeAgo: computeTimeAgo(change.changedAt),
    };
  });
}

export async function getRecentSettingAudits(limit = 10): Promise<SettingAuditForensicEntry[]> {
  const audits = await prisma.settingAudit.findMany({
    orderBy: { changedAt: "desc" },
    take: limit,
    include: {
      changedBy: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });

  return audits.map((audit) => {
    const actor: GovernanceActorIdentity = {
      id: audit.changedBy.id,
      name: audit.changedBy.name,
      email: audit.changedBy.email,
      role: audit.changedBy.role,
    };

    return {
      id: audit.id,
      settingKey: audit.settingKey,
      actor,
      reason: audit.reason,
      severity: "HIGH" as ComplianceSeverity,
      timestamp: audit.changedAt,
      timestampISO: audit.changedAt.toISOString(),
      timeAgo: computeTimeAgo(audit.changedAt),
    };
  });
}
