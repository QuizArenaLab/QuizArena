/**
 * QuizArena — Governance Timeline Engine
 *
 * Builds chronological governance audit timeline from multiple sources:
 * - AuditLog (primary governance events)
 * - RoleChangeAudit (role escalation forensics)
 * - SettingAudit (platform setting changes)
 *
 * Server-side only. Never computed client-side.
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import { prisma } from "@/lib/prisma";
import type {
  GovernanceAuditEntry,
  GovernanceTimeline,
  ComplianceFilter,
  GovernanceActorIdentity,
  GovernanceTargetIdentity,
  DbAuditSeverity,
} from "@/types/super-admin-compliance";
import {
  mapToComplianceSeverity,
  isSovereignAction,
  extractGovernanceCategory,
  computeTimeAgo,
} from "./utils";
import type { Prisma } from "@/generated/prisma";

const DEFAULT_LIMIT = 50;

function buildAuditWhereClause(filter?: ComplianceFilter): Prisma.AuditLogWhereInput {
  const where: Prisma.AuditLogWhereInput = {};

  if (filter?.severity && filter.severity.length > 0) {
    // Map compliance severities back to DB severities for filtering
    const dbSeverities = filter.severity
      .filter((s) => ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(s))
      .map((s) => s as DbAuditSeverity);

    if (dbSeverities.length > 0) {
      where.severity = { in: dbSeverities };
    }
  }

  if (filter?.entityType) {
    where.entityType = filter.entityType as Prisma.AuditLogWhereInput["entityType"];
  }

  if (filter?.actorId) {
    where.actorId = filter.actorId;
  }

  if (filter?.dateFrom || filter?.dateTo) {
    where.createdAt = {};
    if (filter.dateFrom) (where.createdAt as Prisma.DateTimeFilter).gte = filter.dateFrom;
    if (filter.dateTo) (where.createdAt as Prisma.DateTimeFilter).lte = filter.dateTo;
  }

  if (filter?.searchQuery) {
    where.action = { contains: filter.searchQuery, mode: "insensitive" };
  }

  return where;
}

function parseMetadata(raw: unknown): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    if (typeof raw === "string") return JSON.parse(raw) as Record<string, unknown>;
    if (typeof raw === "object") return raw as Record<string, unknown>;
  } catch {
    return null;
  }
  return null;
}

export async function getGovernanceTimeline(
  filter?: ComplianceFilter
): Promise<GovernanceTimeline> {
  const limit = filter?.limit ?? DEFAULT_LIMIT;
  const skip = filter?.page ? (filter.page - 1) * limit : 0;

  const where = buildAuditWhereClause(filter);

  const [entries, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      include: {
        actor: {
          select: { id: true, name: true, email: true, role: true },
        },
        targetUser: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  const mappedEntries: GovernanceAuditEntry[] = entries.map((entry) => {
    const meta = parseMetadata(entry.metadata);
    const isSovereign = isSovereignAction(entry.action, meta);
    const dbSeverity = entry.severity as DbAuditSeverity;
    const complianceSeverity = mapToComplianceSeverity(dbSeverity, isSovereign);
    const category = extractGovernanceCategory(entry.action, entry.entityType, meta);

    const actor: GovernanceActorIdentity | null = entry.actor
      ? {
          id: entry.actor.id,
          name: entry.actor.name,
          email: entry.actor.email,
          role: entry.actor.role,
        }
      : null;

    const target: GovernanceTargetIdentity | null = entry.targetUser
      ? {
          id: entry.targetUser.id,
          name: entry.targetUser.name,
          email: entry.targetUser.email,
        }
      : null;

    return {
      id: entry.id,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      actor,
      target,
      severity: complianceSeverity,
      dbSeverity,
      category,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      metadata: meta,
      timestamp: entry.createdAt,
      timestampISO: entry.createdAt.toISOString(),
      timeAgo: computeTimeAgo(entry.createdAt),
      isSovereignAction: isSovereign,
      governanceCategory: category,
    };
  });

  const timestamps = mappedEntries.map((e) => e.timestamp);

  return {
    entries: mappedEntries,
    totalCount,
    filteredCount: mappedEntries.length,
    hasMore: totalCount > skip + limit,
    oldestTimestamp: timestamps.length > 0 ? timestamps[timestamps.length - 1] : null,
    newestTimestamp: timestamps.length > 0 ? timestamps[0] : null,
  };
}
