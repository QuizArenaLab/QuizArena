import {
  Question,
  QuestionRevision,
  QuestionStatement,
  QuestionExplanation,
  QuestionOption,
} from "@/generated/prisma";
import {
  QuestionResponseDTO,
  QuestionRevisionDTO,
  QuestionOptionDTO,
  QuestionSummaryDTO,
} from "../dto";
import {
  QuestionType,
  QuestionDifficulty,
  QuestionLanguage,
  RevisionStatus,
} from "../../shared/enums";

type PrismaRevisionWithRelations = QuestionRevision & {
  statement?: QuestionStatement | null;
  explanation?: QuestionExplanation | null;
  options?: QuestionOption[];
};

type PrismaQuestionWithRelations = Question & {
  revisions?: PrismaRevisionWithRelations[];
};

export class QuestionMapper {
  public static toOptionDTO(option: QuestionOption): QuestionOptionDTO {
    return {
      id: option.id,
      content: option.content,
      isCorrect: option.isCorrect,
      displayOrder: option.displayOrder,
    };
  }

  public static toRevisionDTO(revision: PrismaRevisionWithRelations): QuestionRevisionDTO {
    return {
      id: revision.id,
      revisionNumber: revision.revisionNumber,
      status: revision.status as RevisionStatus,
      difficulty: revision.difficulty as QuestionDifficulty,
      language: revision.language as QuestionLanguage,
      statement: revision.statement?.content || "",
      explanation: revision.explanation?.content || null,
      options: revision.options
        ?.map(QuestionMapper.toOptionDTO)
        .sort((a, b) => a.displayOrder - b.displayOrder),
      createdAt: revision.createdAt,
      updatedAt: revision.updatedAt,
    };
  }

  public static toQuestionDTO(question: PrismaQuestionWithRelations): QuestionResponseDTO {
    let activeRevisionDTO: QuestionRevisionDTO | undefined;

    if (question.revisions && question.revisions.length > 0) {
      // Prioritize the active published revision if set, else latest
      const active =
        question.revisions.find((r) => r.id === question.currentRevisionId) ||
        question.revisions[0];
      activeRevisionDTO = QuestionMapper.toRevisionDTO(active);
    }

    return {
      id: question.id,
      bankId: question.bankId,
      type: question.type as QuestionType,
      organizationId: question.organizationId,
      currentRevisionId: question.currentRevisionId,
      activeRevision: activeRevisionDTO,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  public static toSummaryDTO(question: PrismaQuestionWithRelations): QuestionSummaryDTO {
    const active =
      question.revisions?.find((r) => r.id === question.currentRevisionId) ||
      question.revisions?.[0];

    return {
      id: question.id,
      type: question.type as QuestionType,
      status: (active?.status as RevisionStatus) || RevisionStatus.DRAFT,
      difficulty: (active?.difficulty as QuestionDifficulty) || QuestionDifficulty.MEDIUM,
      snippet: active?.statement?.content?.substring(0, 100) || "",
      updatedAt: question.updatedAt,
    };
  }
}
