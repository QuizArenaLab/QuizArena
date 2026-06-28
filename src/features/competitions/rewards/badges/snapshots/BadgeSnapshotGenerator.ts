import { prisma } from "@/lib/prisma";
import { RewardLedgerService } from "../../ledger/RewardLedgerService";

export class BadgeSnapshotGenerator {
  /**
   * Idempotently issues a badge snapshot.
   */
  public static async issueBadge(
    userId: string,
    badgeType: string,
    competitionId?: string
  ) {
    try {
      // 1. Idempotency Check
      const existing = await prisma.badgeSnapshot.findFirst({
        where: {
          userId,
          badgeType,
          competitionId: competitionId || null
        }
      });

      if (existing) {
        return existing;
      }

      // 2. Create Snapshot
      const badge = await prisma.badgeSnapshot.create({
        data: {
          userId,
          badgeType,
          competitionId
        }
      });

      // 3. Audit
      await RewardLedgerService.recordEvent({
        rewardEvent: "BADGE_ISSUED",
        rewardType: "BADGE",
        recipientId: userId,
        referenceId: badge.id,
        pipelineStage: "BADGE_GENERATION",
        status: "SUCCESS"
      });

      return badge;
    } catch (error: any) {
       await RewardLedgerService.recordEvent({
        rewardEvent: "BADGE_ISSUED",
        rewardType: "BADGE",
        recipientId: userId,
        pipelineStage: "BADGE_GENERATION",
        status: "FAILED",
        failureReason: error.message
      });
      throw error;
    }
  }
}
