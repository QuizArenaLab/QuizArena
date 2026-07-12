import { PrismaClient } from "@/generated/prisma";
import { QuestionRepository } from "../repositories/QuestionRepository";
import { QuestionRevisionRepository } from "../repositories/QuestionRevisionRepository";
import { RevisionStatus } from "../../shared/enums";
import { ConflictError, NotFoundError } from "../errors";

export class QuestionPublishingService {
  private prisma: PrismaClient;
  private questionRepo: QuestionRepository;
  private revisionRepo: QuestionRevisionRepository;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.questionRepo = new QuestionRepository();
    this.revisionRepo = new QuestionRevisionRepository();
  }

  /**
   * Publishes a draft revision and points the aggregate root to it.
   */
  public async publishRevision(
    userId: string,
    questionId: string,
    revisionId: string
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 1. Verify revision exists and belongs to the question
      const revision = await tx.questionRevision.findUnique({
        where: { id: revisionId },
      });
      if (!revision || revision.questionId !== questionId) {
        throw new NotFoundError("Revision not found or mismatch");
      }
      if (revision.status === RevisionStatus.PUBLISHED) {
        throw new ConflictError("Revision is already published");
      }

      // 2. Mark this revision as published
      await tx.questionRevision.update({
        where: { id: revisionId },
        data: {
          status: RevisionStatus.PUBLISHED,
          publishedById: userId,
          publishedAt: new Date(),
        },
      });

      // 3. Update Aggregate Root Pointer
      await this.questionRepo.updateActiveRevision(tx, questionId, revisionId);

      // (Optional) Archive previously published revisions here
      await tx.questionRevision.updateMany({
        where: {
          questionId,
          status: RevisionStatus.PUBLISHED,
          id: { not: revisionId },
        },
        data: {
          status: RevisionStatus.ARCHIVED,
          archivedById: userId,
          archivedAt: new Date(),
        },
      });
    });
  }
}
