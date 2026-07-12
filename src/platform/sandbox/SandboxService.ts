// @ts-nocheck
import { prisma } from "../../lib/prisma";

export class SandboxService {
  /**
   * Creates an isolated clone of a competition for end-to-end SME QA testing.
   */
  async createSandbox(competitionId: string, smeUserId: string) {
    const original = await prisma.challenge.findUnique({
      where: { id: competitionId },
      include: { questions: { include: { question: { include: { options: true } } } } },
    });

    if (!original) throw new Error("Original competition not found");

    const sandbox = await prisma.challenge.create({
      data: {
        title: `[SANDBOX] ${original.title}`,
        slug: `sandbox-${original.slug}-${Date.now()}`,
        description: `Sandbox clone for QA testing.`,
        category: original.category,
        difficulty: original.difficulty,
        durationInMinutes: original.durationInMinutes,
        totalQuestions: original.totalQuestions,
        status: "LIVE",
        visibility: "PRIVATE",
        createdById: smeUserId,
      },
    });

    // Copy questions
    await Promise.all(
      original.questions.map((cq) =>
        prisma.challengeQuestion.create({
          data: { challengeId: sandbox.id, questionId: cq.questionId, orderIndex: cq.orderIndex },
        })
      )
    );

    return sandbox;
  }

  /**
   * Cleans up all sandbox competitions and their generated attempts/certificates.
   */
  async cleanupSandboxes() {
    console.log("[SandboxService] Cleaning up expired sandboxes...");
    const expiredSandboxes = await prisma.challenge.findMany({
      where: { title: { startsWith: "[SANDBOX]" } }, // Simple heuristic for demo
    });

    for (const sandbox of expiredSandboxes) {
      await prisma.challenge.delete({ where: { id: sandbox.id } });
    }

    return expiredSandboxes.length;
  }
}

export const sandboxService = new SandboxService();
