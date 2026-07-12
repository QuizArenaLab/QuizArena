import { PrismaClient } from "@/generated/prisma";
import { QuestionRepository } from "../repositories/QuestionRepository";
import { QuestionRevisionRepository } from "../repositories/QuestionRevisionRepository";
import { CreateQuestionInput } from "../../shared/schemas";
import { QuestionResponseDTO } from "../dto";
import { QuestionMapper } from "../mappers/QuestionMapper";
import { RevisionStatus } from "../../shared/enums";

export class QuestionService {
  private prisma: PrismaClient;
  private questionRepo: QuestionRepository;
  private revisionRepo: QuestionRevisionRepository;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.questionRepo = new QuestionRepository();
    this.revisionRepo = new QuestionRevisionRepository();
  }

  /**
   * Orchestrates the creation of a Question and its initial Draft revision within a single transaction.
   */
  public async createQuestion(
    userId: string,
    input: CreateQuestionInput
  ): Promise<QuestionResponseDTO> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Create the Aggregate Root
      const question = await this.questionRepo.createQuestion(tx, {
        bankId: input.bankId,
        organizationId: input.organizationId || null,
        type: input.type,
        createdById: userId,
      });

      // 2. Create the Initial Draft Revision
      const revision = await this.revisionRepo.createRevision(tx, {
        questionId: question.id,
        organizationId: input.organizationId || null,
        revisionNumber: 1,
        status: RevisionStatus.DRAFT,
        difficulty: input.difficulty,
        language: input.language,
        chapterId: input.chapterId || null,
        statement: {
          create: { content: input.statement },
        },
        explanation: input.explanation
          ? {
              create: { content: input.explanation },
            }
          : undefined,
        options: input.options
          ? {
              create: input.options.map((o) => ({
                content: o.content,
                isCorrect: o.isCorrect,
                displayOrder: o.displayOrder,
              })),
            }
          : undefined,
      });

      // Fetch with relations to map to DTO
      const fullQuestion = await tx.question.findUniqueOrThrow({
        where: { id: question.id },
        include: {
          revisions: {
            where: { id: revision.id },
            include: { statement: true, explanation: true, options: true },
          },
        },
      });

      return QuestionMapper.toQuestionDTO(fullQuestion);
    });
  }
}
