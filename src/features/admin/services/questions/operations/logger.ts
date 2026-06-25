import { prisma } from "@/lib/prisma";
import type { OperationalAuditAction } from "@/generated/prisma";

export async function logOperationalAudit({
  issueId,
  action,
  actorId,
  reason,
}: {
  issueId: string;
  action: OperationalAuditAction;
  actorId?: string;
  reason?: string;
}) {
  await prisma.operationalIssueAudit.create({
    data: {
      issueId,
      action,
      actorId,
      reason,
    },
  });
}
