import { PrismaClient, Prisma } from "@/generated/prisma";
type PrismaTransactionClient = Prisma.TransactionClient;

export class QuestionRevisionRepository {
  public async createRevision(
    tx: PrismaTransactionClient,
    data: Prisma.QuestionRevisionUncheckedCreateInput
  ) {
    return tx.questionRevision.create({
      data,
    });
  }

  public async getLatestRevisionNumber(
    tx: PrismaTransactionClient,
    questionId: string
  ): Promise<number> {
    const latest = await tx.questionRevision.findFirst({
      where: { questionId },
      orderBy: { revisionNumber: "desc" },
      select: { revisionNumber: true },
    });
    return latest?.revisionNumber || 0;
  }

  public async updateRevisionStatus(
    tx: PrismaTransactionClient,
    revisionId: string,
    status: any // RevisionStatus
  ) {
    return tx.questionRevision.update({
      where: { id: revisionId },
      data: { status },
    });
  }
}
