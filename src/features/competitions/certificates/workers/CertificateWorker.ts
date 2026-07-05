import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export interface CertificateEligibilityPayload {
  resultId: string;
  competitionId: string;
  score: number;
  percentage: number;
}

export class CertificateWorker {
  /**
   * Processes a CertificateEligibilityGenerated event.
   * Checks if the user qualifies for a certificate and issues it if so.
   */
  public static async processEligibility(payload: CertificateEligibilityPayload) {
    console.log(`[CertificateWorker] Processing eligibility for result: ${payload.resultId}`);

    // Hardcoded threshold for MVP (can be moved to CompetitionConfig later)
    const PASSING_THRESHOLD = 50;
    const WINNER_THRESHOLD = 90; // Just an example for WINNER tier

    if (payload.percentage < PASSING_THRESHOLD) {
      console.log(`[CertificateWorker] User did not meet the passing threshold (${payload.percentage}% < ${PASSING_THRESHOLD}%).`);
      return;
    }

    // Determine the type of certificate
    let certificateType = "PARTICIPATION";
    if (payload.percentage >= WINNER_THRESHOLD) {
      certificateType = "WINNER";
    }

    // Fetch necessary data
    const result = await prisma.submissionResult.findUnique({
      where: { id: payload.resultId },
      include: {
        submissionRecord: {
          include: {
            attempt: {
              include: {
                competition: true,
                user: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new Error(`SubmissionResult not found for id: ${payload.resultId}`);
    }

    const { user, competition } = result.submissionRecord.attempt;

    // Generate cryptographic verification token
    const verificationToken = crypto.randomBytes(16).toString("hex");

    // Generate a QR Payload for the viewer UI to consume (could be a direct link to /verify)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const qrPayload = `${baseUrl}/verify/certificate/${verificationToken}`;

    // Use transaction to ensure no duplicates
    const snapshot = await prisma.certificateSnapshot.upsert({
      where: {
        userId_competitionId_certificateType: {
          userId: user.id,
          competitionId: competition.id,
          certificateType,
        },
      },
      update: {
        // Typically, certificates are immutable, but if a re-attempt gets a better score,
        // we might update the score/date. For immutable ones, we'd just ignore.
        score: payload.score,
        completionDate: new Date(),
        issueDate: new Date(),
      },
      create: {
        verificationToken,
        participantName: user.name || "Aspirant",
        competitionName: competition.title,
        competitionVersion: "1.0", // Mock for MVP
        certificateType,
        score: payload.score,
        completionDate: new Date(),
        qrPayload,
        brandAssetsVersion: "1.0",
        userId: user.id,
        competitionId: competition.id,
      },
    });

    console.log(`[CertificateWorker] CertificateSnapshot issued: ${snapshot.id} (${certificateType})`);

    return snapshot;
  }
}
