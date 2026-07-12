import { QuestionIdentity } from "./QuestionIdentity";
import { QuestionDifficulty } from "./QuestionDifficulty";
import { QuestionVisibility } from "./QuestionVisibility";
import { QuestionLifecycle } from "./QuestionLifecycle";
import { QuestionLanguage } from "./QuestionLanguage";
import { QuestionCategory } from "./QuestionCategory";
import { QuestionTags } from "./QuestionTags";
import { QuestionType } from "./QuestionType";

export interface QuestionMetadata {
  identity: QuestionIdentity;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  visibility: QuestionVisibility;
  lifecycle: QuestionLifecycle;
  language: QuestionLanguage;
  categories: QuestionCategory[];
  tags: QuestionTags;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  reviewedAt?: Date;
  approvedAt?: Date;
  archivedAt?: Date;
}
