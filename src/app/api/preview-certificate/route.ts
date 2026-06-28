import { CertificateRenderer } from "@/features/competitions/rewards/certificates/renderer/CertificateRenderer";
import { CertificateSnapshot } from "@/generated/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") === "WINNER" ? "WINNER" : "PARTICIPATION";

  // Create a mock snapshot to render the template
  const mockSnapshot: CertificateSnapshot = {
    id: "mock-123",
    verificationToken: "ABCDEF1234567890",
    participantName: "Chiranjeevi PK",
    competitionName: "Advanced Architecture & Systems Design",
    competitionVersion: "1.0",
    certificateType: type,
    rank: type === "WINNER" ? 1 : null,
    score: type === "WINNER" ? 98 : 85,
    completionDate: new Date(),
    issueDate: new Date(),
    certificateVersion: "1.0",
    qrPayload: "https://quizarena.com/verify/certificate/ABCDEF1234567890",
    brandAssetsVersion: "1.0",
    issuer: "QuizArena Official",
    userId: "user-123",
    competitionId: "comp-123",
    pdfUrl: null
  };

  const html = CertificateRenderer.renderHtml(mockSnapshot);
  
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
