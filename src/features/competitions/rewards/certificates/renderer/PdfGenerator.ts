import { CertificateSnapshot } from "@/generated/prisma";
import { CertificateRenderer } from "./CertificateRenderer";
import { prisma } from "@/lib/prisma";
import { RewardLedgerService } from "../../ledger/RewardLedgerService";

export class PdfGenerator {
  /**
   * Asynchronously generates a PDF from the HTML render and saves it to storage.
   */
  public static async generateAndStore(snapshot: CertificateSnapshot) {
    try {
      console.log(`[PdfGenerator] Starting async PDF generation for snapshot: ${snapshot.id}`);
      
      const html = CertificateRenderer.renderHtml(snapshot);
      
      // In a real system, we'd use Puppeteer, Playwright, or a PDF generation API here.
      // e.g., const pdfBuffer = await puppeteer.generatePdf(html);
      // const url = await S3Upload(pdfBuffer);
      
      // Simulating external PDF generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockPdfUrl = `https://storage.quizarena.com/certificates/${snapshot.verificationToken}.pdf`;
      
      // Update snapshot with generated PDF URL
      await prisma.certificateSnapshot.update({
        where: { id: snapshot.id },
        data: { pdfUrl: mockPdfUrl }
      });

      await RewardLedgerService.recordEvent({
        rewardEvent: "CERTIFICATE_PDF_GENERATED",
        rewardType: "CERTIFICATE",
        recipientId: snapshot.userId,
        referenceId: snapshot.id,
        pipelineStage: "PDF_GENERATION",
        status: "SUCCESS"
      });

      console.log(`[PdfGenerator] PDF generation completed for: ${snapshot.id}`);
    } catch (error: any) {
      console.error(`[PdfGenerator] Failed to generate PDF for ${snapshot.id}`, error);
      
      await RewardLedgerService.recordEvent({
        rewardEvent: "CERTIFICATE_PDF_GENERATED",
        rewardType: "CERTIFICATE",
        recipientId: snapshot.userId,
        referenceId: snapshot.id,
        pipelineStage: "PDF_GENERATION",
        status: "FAILED",
        failureReason: error.message
      });
    }
  }
}
