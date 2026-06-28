import { prisma } from "@/lib/prisma";
import { AuditEntry, CreateAuditEntryOptions } from "../types/audit.types";

export async function getAuditTrail(competitionId: string): Promise<AuditEntry[]> {
  const trail = await prisma.competitionAudit.findMany({
    where: { competitionId },
    orderBy: { createdAt: "desc" },
    include: { actor: { select: { id: true, name: true, email: true } } },
  });

  return trail.map((entry) => ({
    id: entry.id,
    action: entry.action,
    actorId: entry.actorId,
    actorName: entry.actor?.name || entry.actor?.email || "System",
    previousState: entry.previousState || undefined,
    newState: entry.newState || undefined,
    reason: entry.reason || undefined,
    metadata: entry.metadata ? (entry.metadata as Record<string, unknown>) : undefined,
    createdAt: entry.createdAt.toISOString(),
  }));
}

export async function createAuditEntry(options: CreateAuditEntryOptions) {
  return await prisma.competitionAudit.create({
    data: {
      competitionId: options.competitionId,
      action: options.action as any,
      actorId: options.actorId,
      previousState: options.previousState as any,
      newState: options.newState as any,
      reason: options.reason,
      metadata: options.metadata ? (options.metadata as any) : {},
    },
  });
}
