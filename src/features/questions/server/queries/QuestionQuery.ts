import { PrismaClient } from "@/generated/prisma";
import { QuestionMapper } from "../mappers/QuestionMapper";
import { QuestionResponseDTO, QuestionSummaryDTO } from "../dto";

export class QuestionQuery {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async getQuestionById(questionId: string): Promise<QuestionResponseDTO | null> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId, deletedAt: null },
      include: {
        revisions: {
          include: {
            statement: true,
            explanation: true,
            options: true,
          },
          orderBy: { revisionNumber: "desc" },
          take: 1, // Usually we just fetch the active or latest for a basic read
        },
      },
    });

    if (!question) return null;
    return QuestionMapper.toQuestionDTO(question);
  }

  public async getQuestionsByBank(
    bankId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<QuestionSummaryDTO[]> {
    const questions = await this.prisma.question.findMany({
      where: { bankId, deletedAt: null },
      include: {
        revisions: {
          include: { statement: true }, // Only need statement for snippet
          orderBy: { revisionNumber: "desc" },
          take: 1,
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });

    return questions.map(QuestionMapper.toSummaryDTO);
  }
}
