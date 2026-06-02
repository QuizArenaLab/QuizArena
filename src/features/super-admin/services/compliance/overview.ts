/**
 * QuizArena — Compliance Overview Aggregator
 *
 * Computes aggregate compliance statistics for the overview panel.
 * Server-side only — all DB queries optimized with indexed fields.
 *
 * Phase 7.6: Enterprise Audit & Compliance Center
 */

import { prisma } from "@/lib/prisma";
import type {
  ComplianceOverview,
  CategoryBreakdown,
  GovernanceCategory,
} from "@/types/super-admin-compliance";
import { extractGovernanceCategory } from "./utils";

export async function getComplianceOverview(): Promise<ComplianceOverview> {
  const now = new Date();
  const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ago7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const ago30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalEvents,
    events24h,
    events7d,
    events30d,
    severityGroups,
    criticalEvents24h,
    highRiskEvents7d,
    latestEvent,
    uniqueActorResult,
  ] = await Promise.all([
    // Total events (all time)
    prisma.auditLog.count(),

    // Events in last 24h
    prisma.auditLog.count({
      where: { createdAt: { gte: ago24h } },
    }),

    // Events in last 7d
    prisma.auditLog.count({
      where: { createdAt: { gte: ago7d } },
    }),

    // Events in last 30d
    prisma.auditLog.count({
      where: { createdAt: { gte: ago30d } },
    }),

    // Group by severity
    prisma.auditLog.groupBy({
      by: ["severity"],
      _count: { severity: true },
    }),

    // CRITICAL events in last 24h
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago24h },
        severity: { in: ["CRITICAL", "HIGH"] },
      },
    }),

    // HIGH+ events in last 7d
    prisma.auditLog.count({
      where: {
        createdAt: { gte: ago7d },
        severity: { in: ["HIGH", "CRITICAL"] },
      },
    }),

    // Latest event
    prisma.auditLog.findFirst({
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),

    // Unique actors (raw query for distinct)
    prisma.auditLog.findMany({
      where: { actorId: { not: null } },
      select: { actorId: true },
      distinct: ["actorId"],
    }),
  ]);

  // Build severity breakdown
  const bySeverity = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
    SEVERE: 0,
  };

  for (const group of severityGroups) {
    const key = group.severity as keyof typeof bySeverity;
    if (key in bySeverity) {
      bySeverity[key] = group._count.severity;
    }
  }

  // SEVERE is a UI-layer concept — approximate from CRITICAL + sovereign action patterns
  // We check for SUPER_ADMIN-tagged audit events as a proxy
  const severeCount = await prisma.auditLog.count({
    where: {
      severity: "CRITICAL",
      action: {
        contains: "SUPER_ADMIN",
      },
    },
  });
  bySeverity.SEVERE = severeCount;

  // Build category breakdown from recent 100 events
  const recentForCategoryAnalysis = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { action: true, entityType: true, metadata: true, createdAt: true },
  });

  const categoryMap = new Map<GovernanceCategory, { count: number; lastEventAt: Date | null }>();

  for (const entry of recentForCategoryAnalysis) {
    let meta: Record<string, unknown> | null = null;
    try {
      if (entry.metadata) {
        meta =
          typeof entry.metadata === "string"
            ? (JSON.parse(entry.metadata) as Record<string, unknown>)
            : (entry.metadata as Record<string, unknown>);
      }
    } catch {
      meta = null;
    }

    const category = extractGovernanceCategory(entry.action, entry.entityType, meta);
    const existing = categoryMap.get(category);

    if (existing) {
      existing.count += 1;
      if (!existing.lastEventAt || entry.createdAt > existing.lastEventAt) {
        existing.lastEventAt = entry.createdAt;
      }
    } else {
      categoryMap.set(category, { count: 1, lastEventAt: entry.createdAt });
    }
  }

  const byCategory: CategoryBreakdown[] = Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      count: data.count,
      lastEventAt: data.lastEventAt,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    totalEvents,
    events24h,
    events7d,
    events30d,
    bySeverity,
    byCategory,
    criticalEvents24h,
    highRiskEvents7d,
    immutabilityEnforced: true, // Append-only by architecture
    lastEventAt: latestEvent?.createdAt ?? null,
    lastEventAtISO: latestEvent?.createdAt?.toISOString() ?? null,
    uniqueActors: uniqueActorResult.length,
  };
}
