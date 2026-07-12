import { PrismaClient, Prisma } from "@/generated/prisma";

// Define a type that accepts either the main PrismaClient or a Prisma.TransactionClient
export type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export class QuestionRepository {
  /**
   * Creates the Question aggregate root.
   */
  public async createQuestion(
    tx: PrismaTransactionClient,
    data: Prisma.QuestionUncheckedCreateInput
  ) {
    return tx.question.create({
      data,
    });
  }

  /**
   * Updates the Question aggregate root pointer.
   */
  public async updateActiveRevision(
    tx: PrismaTransactionClient,
    questionId: string,
    revisionId: string
  ) {
    return tx.question.update({
      where: { id: questionId },
      data: { currentRevisionId: revisionId },
    });
  }

  /**
   * Soft deletes the Question aggregate root.
   */
  public async softDeleteQuestion(tx: PrismaTransactionClient, questionId: string) {
    return tx.question.update({
      where: { id: questionId },
      data: { deletedAt: new Date() },
    });
  }
}
