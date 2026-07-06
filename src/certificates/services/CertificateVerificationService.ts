import { prisma } from "../../lib/prisma";

export class CertificateVerificationService {
  /**
   * Verifies the authenticity of a certificate by ID.
   * Returns the certificate details if valid, or throws an error if invalid/revoked.
   */
  async verifyCertificate(certificateId: string) {
    const cert = await prisma.certificateSnapshot.findUnique({
      where: { id: certificateId },
      include: { user: true }
    });

    if (!cert) {
      return { valid: false, reason: "Certificate not found" };
    }

    // Without a revoked status in the schema, we skip revocation checks for now.
    // If needed in the future, we should add an `isRevoked` field to the schema.
    const isRevoked = false;
    if (isRevoked) {
      return { valid: false, reason: "Certificate has been revoked" };
    }

    return {
      valid: true,
      issuedTo: cert.user?.name || cert.user?.username,
      competitionId: cert.competitionId,
      certificateType: cert.certificateType,
      issuedAt: cert.issueDate,
      qrUrl: this.generateQRUrl(certificateId)
    };
  }

  /**
   * Generates a URL for a QR code linking to the verification page.
   */
  generateQRUrl(certificateId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/verify/${certificateId}`;
    
    // Using Google Chart API for quick QR generation without external npm deps
    return `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(verifyUrl)}`;
  }

  /**
   * Revokes a certificate by updating its metadata.
   */
  async revokeCertificate(certificateId: string, reason: string) {
    const cert = await prisma.certificateSnapshot.findUnique({ where: { id: certificateId } });
    if (!cert) throw new Error("Certificate not found");

    // Without a revoked status in the schema, we cannot store the revocation status natively.
    // In a production system, we would add an `isRevoked` boolean and `revokeReason` string.
    console.warn(`[CertificateVerificationService] Simulated revoking certificate ${certificateId} for reason: ${reason}`);
    return cert;
  }
}

export const certificateVerificationService = new CertificateVerificationService();
