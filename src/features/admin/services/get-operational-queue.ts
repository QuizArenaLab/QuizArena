import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getOperationalQueue = unstable_cache(
  async () => {
    const [pendingReports, pendingApprovals, userAppeals, contentReview] = await Promise.all([
      prisma.report.count({ where: { status: "OPEN" } }),
      prisma.challenge.count({ where: { status: "DRAFT" } }),
      prisma.report.count({ where: { status: "OPEN", type: "USER_ABUSE" } }),
      prisma.question.count({ where: { status: "REVIEW" } }),
    ]);

    const attentionRequires = {
      pendingReports,
      pendingApprovals,
      userAppeals,
      contentReview,
    };

    const rawReports = await prisma.report.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { reviewedBy: true }
    });

    const rawApprovals = await prisma.challenge.findMany({
      where: { status: "DRAFT" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { reviewedBy: true }
    });

    const queueItems = [
      ...rawReports.map((r: any) => ({
        id: `report-${r.id}`,
        type: "Report",
        title: r.reason || "Report Issue",
        priority: r.priority === 'CRITICAL' ? 'High' : r.priority === 'HIGH' ? 'High' : r.priority === 'MEDIUM' ? 'Medium' : 'Low',
        createdAt: r.createdAt,
        assignedTo: r.reviewedBy?.name || "Unassigned",
        action: "Review"
      })),
      ...rawApprovals.map((c: any) => ({
        id: `challenge-${c.id}`,
        type: "Competition",
        title: c.title,
        priority: "Medium",
        createdAt: c.createdAt,
        assignedTo: c.reviewedBy?.name || "Unassigned",
        action: "Approve"
      }))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);

    return { attentionRequires, queueItems };
  },
  ["admin-operational-queue"],
  { revalidate: 15, tags: ["admin", "queue"] }
);
