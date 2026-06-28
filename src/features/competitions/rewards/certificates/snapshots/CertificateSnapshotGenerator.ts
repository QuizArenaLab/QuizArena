import { prisma } from "@/lib/prisma";
import { RewardLedgerService } from "../../ledger/RewardLedgerService";
import { v4 as uuidv4 } from "uuid";

export class CertificateSnapshotGenerator {
  /**
   * Idempotently generates an immutable Certificate Snapshot.
   */
  public static async generate(
    userId: string,
    competitionId: string,
    participantName: string,
    competitionName: string,
    competitionVersion: string,
    certificateType: "PARTICIPATION" | "WINNER" | "EXCELLENCE" | "TOP_PERFORMER",
    score: number | null,
    rank: number | null
  ) {
    try {
      // 1. Idempotency Check
      const existing = await prisma.certificateSnapshot.findUnique({
        where: {
          userId_competitionId_certificateType: {
            userId,
            competitionId,
            certificateType
          }
        }
      });

      if (existing) {
        console.log(`[CertificateGenerator] Snapshot already exists for User ${userId}, skipping.`);
        return existing;
      }

      // 2. Generate Unique Verification Token
      const verificationToken = uuidv4().replace(/-/g, "").substring(0, 16).toUpperCase();
      const qrPayload = `https://quizarena.com/verify/certificate/${verificationToken}`; // Mock URL for QR

      // 3. Create Immutable Snapshot
      const snapshot = await prisma.certificateSnapshot.create({
        data: {
          verificationToken,
          participantName,
          competitionName,
          competitionVersion: "1.0",
          certificateType,
          rank,
          score,
          completionDate: new Date(),
          issueDate: new Date(),
          certificateVersion: "1.0",
          qrPayload,
          brandAssetsVersion: "1.0",
          userId,
          competitionId
        }
      });

      // 4. Audit
      await RewardLedgerService.recordEvent({
        rewardEvent: "CERTIFICATE_SNAPSHOT_GENERATED",
        rewardType: "CERTIFICATE",
        recipientId: userId,
        referenceId: snapshot.id,
        pipelineStage: "SNAPSHOT_GENERATION",
        status: "SUCCESS"
      });

      return snapshot;
    } catch (error: any) {
      await RewardLedgerService.recordEvent({
        rewardEvent: "CERTIFICATE_SNAPSHOT_GENERATED",
        rewardType: "CERTIFICATE",
        recipientId: userId,
        pipelineStage: "SNAPSHOT_GENERATION",
        status: "FAILED",
        failureReason: error.message
      });
      throw error;
    }
  }
}
