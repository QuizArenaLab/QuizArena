// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { OperationalIssueStatus } from "@/generated/prisma";
import { logOperationalAudit } from "./logger";

export async function getOperationsDashboardMetrics() {
  const [
    missingExplanations,
    duplicateCandidates,
    highReports,
    lowConfidence,
    unused,
    outdated,
    noAttempts,
    autoResolvedToday,
  ] = await Promise.all([
    prisma.operationalIssue.count({
      where: { issueType: "MISSING_EXPLANATION", status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    prisma.operationalIssue.count({
      where: { issueType: "DUPLICATE_CANDIDATE", status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    prisma.operationalIssue.count({
      where: { issueType: "HIGH_REPORTS", status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    prisma.operationalIssue.count({
      where: { issueType: "LOW_CONFIDENCE", status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    prisma.operationalIssue.count({
      where: { issueType: "UNUSED", status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    prisma.operationalIssue.count({
      where: { issueType: "OUTDATED", status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    prisma.operationalIssue.count({
      where: { issueType: "NO_ATTEMPTS", status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    prisma.operationalIssue.count({
      where: {
        status: "AUTO_RESOLVED",
        resolvedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
  ]);

  return {
    missingExplanations,
    duplicateCandidates,
    highReports,
    lowConfidence,
    unused,
    outdated,
    noAttempts,
    autoResolvedToday,
  };
}

export async function getOperationalIssues(params: {
  issueTypes?: string[];
  status?: OperationalIssueStatus[];
  skip?: number;
  take?: number;
}) {
  const where: any = {
    status: { in: params.status ?? ["OPEN", "IN_PROGRESS"] },
  };

  if (params.issueTypes && params.issueTypes.length > 0) {
    where.issueType = { in: params.issueTypes };
  }

  const [total, issues] = await Promise.all([
    prisma.operationalIssue.count({ where }),
    prisma.operationalIssue.findMany({
      where,
      include: {
        question: {
          select: {
            id: true,
            questionCode: true,
            question: true,
            category: true,
            status: true,
          },
        },
        assignedTo: {
          select: { id: true, name: true },
        },
      },
      orderBy: [
        { priority: "desc" }, // CRITICAL down to LOW (since CRITICAL is highest enum value conceptually... wait Prisma orders enums by schema order)
        // If Prisma schema order is LOW, MEDIUM, HIGH, CRITICAL, then 'desc' will put CRITICAL first.
        { detectedAt: "desc" },
      ],
      skip: params.skip,
      take: params.take ?? 50,
    }),
  ]);

  return { total, issues };
}

export async function getIssueDetails(issueId: string) {
  return prisma.operationalIssue.findUnique({
    where: { id: issueId },
    include: {
      question: {
        include: {
          usageStats: true,
          analytics: true,
        },
      },
      audits: {
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { id: true, name: true } } },
      },
      assignedTo: { select: { id: true, name: true } },
    },
  });
}

export async function dismissIssue(issueId: string, adminId: string, reason: string) {
  const issue = await prisma.operationalIssue.update({
    where: { id: issueId },
    data: {
      status: "DISMISSED",
      dismissedById: adminId,
      dismissedAt: new Date(),
      resolutionNotes: reason,
    },
  });

  await logOperationalAudit({
    issueId,
    action: "DISMISSED",
    actorId: adminId,
    reason,
  });

  return issue;
}

export async function resolveIssue(issueId: string, adminId: string, reason?: string) {
  const issue = await prisma.operationalIssue.update({
    where: { id: issueId },
    data: {
      status: "RESOLVED",
      resolvedAt: new Date(),
      resolutionNotes: reason,
    },
  });

  await logOperationalAudit({
    issueId,
    action: "RESOLVED",
    actorId: adminId,
    reason,
  });

  return issue;
}

export async function assignIssue(issueId: string, adminId: string, assigneeId: string) {
  const issue = await prisma.operationalIssue.update({
    where: { id: issueId },
    data: { assignedToId: assigneeId, status: "IN_PROGRESS" },
  });

  await logOperationalAudit({
    issueId,
    action: "ASSIGNED",
    actorId: adminId,
    reason: `Assigned to ${assigneeId}`,
  });

  return issue;
}
