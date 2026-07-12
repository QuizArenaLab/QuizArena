import { QuestionStatus } from "./QuestionStatus";
import { QuestionVersion } from "./QuestionVersion";

export interface QuestionLifecycle {
  status: QuestionStatus;
  version: QuestionVersion;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}
