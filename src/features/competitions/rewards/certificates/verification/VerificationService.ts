import { prisma } from "@/lib/prisma";

export class VerificationService {
  /**
   * Resolves a verification token strictly for public viewing.
   * Strips all PII and sensitive user IDs.
   */
  public static async verifyToken(token: string) {
    const snapshot = await prisma.certificateSnapshot.findUnique({
      where: { verificationToken: token },
      select: {
        participantName: true,
        competitionName: true,
        certificateType: true,
        issueDate: true,
        completionDate: true,
        certificateVersion: true,
        issuer: true,
        pdfUrl: true
      }
    });

    if (!snapshot) {
      return null;
    }

    return {
      isValid: true,
      verifiedAt: new Date(),
      certificate: snapshot
    };
  }
}
