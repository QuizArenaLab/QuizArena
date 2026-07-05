import { prisma } from "@/lib/prisma";

export class CertificateFacade {
  /**
   * Fetch all certificates for a user
   */
  public static async getUserCertificates(userId: string) {
    const certificates = await prisma.certificateSnapshot.findMany({
      where: { userId },
      orderBy: { issueDate: "desc" },
    });
    return certificates;
  }

  /**
   * Verify a certificate by its unique cryptographic token
   */
  public static async verifyCertificate(token: string) {
    const certificate = await prisma.certificateSnapshot.findUnique({
      where: { verificationToken: token },
    });
    return certificate;
  }
}
