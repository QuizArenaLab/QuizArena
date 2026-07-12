import {
  QuestionType,
  QuestionDifficulty,
  QuestionLanguage,
  RevisionStatus,
} from "../../shared/enums";

export interface QuestionOptionDTO {
  id: string;
  content: string;
  isCorrect: boolean;
  displayOrder: number;
}

export interface QuestionRevisionDTO {
  id: string;
  revisionNumber: number;
  status: RevisionStatus;
  difficulty: QuestionDifficulty;
  language: QuestionLanguage;
  statement: string;
  explanation?: string | null;
  options?: QuestionOptionDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionResponseDTO {
  id: string;
  bankId: string;
  type: QuestionType;
  organizationId: string | null;
  currentRevisionId: string | null;
  activeRevision?: QuestionRevisionDTO;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionSummaryDTO {
  id: string;
  type: QuestionType;
  status: RevisionStatus;
  difficulty: QuestionDifficulty;
  snippet: string;
  updatedAt: Date;
}
