import { prisma } from "@/lib/prisma";
import type { TimelineEvent } from "@/types/super-admin-dashboard";

export async function getActivityTimeline(): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = [];

  // Get recent role changes
  const roleChanges = await prisma.roleChangeAudit.findMany({
    orderBy: { changedAt: "desc" },
    take: 5,
    include: { targetUser: true, changedBy: true },
  });

  for (const rc of roleChanges) {
    events.push({
      id: `role-${rc.id}`,
      type: "GOVERNANCE",
      title: "Role Escalation",
      description: `${rc.targetUser.name || "User"} promoted to ${rc.newRole}`,
      timestamp: rc.changedAt,
      actor: rc.changedBy.name || "System",
    });
  }

  // Get recent high risk audit logs
  const audits = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { actor: true },
  });

  for (const audit of audits) {
    events.push({
      id: `audit-${audit.id}`,
      type: audit.entityType === "SECURITY" ? "SECURITY" : "OPERATIONS",
      title: audit.action,
      description: `Target: ${audit.targetUserId || "N/A"}, Severity: ${audit.severity}`,
      timestamp: audit.createdAt,
      actor: audit.actor?.name || audit.actorId || "System",
    });
  }

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 8);
}
