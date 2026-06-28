import { prisma } from "@/lib/prisma";

export interface CreateLedgerEntryParams {
  rewardEvent: string;
  rewardType: string;
  recipientId: string;
  referenceId?: string;
  pipelineStage: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  failureReason?: string;
}

export class RewardLedgerService {
  /**
   * Appends an immutable record to the Reward Ledger.
   */
  public static async recordEvent(params: CreateLedgerEntryParams) {
    try {
      await prisma.rewardLedger.create({
        data: {
          rewardEvent: params.rewardEvent,
          rewardType: params.rewardType,
          recipientId: params.recipientId,
          referenceId: params.referenceId,
          pipelineStage: params.pipelineStage,
          status: params.status,
          failureReason: params.failureReason
        }
      });
      console.log(`[RewardLedger] Recorded ${params.rewardEvent} for User: ${params.recipientId} Status: ${params.status}`);
    } catch (error: any) {
      console.error("[RewardLedger] CRITICAL: Failed to write to audit ledger", error);
      // In a strict financial/reward system, we might alert devops here or use a fallback queue
    }
  }
}
