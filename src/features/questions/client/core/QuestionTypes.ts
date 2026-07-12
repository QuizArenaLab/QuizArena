import { QuestionMetadata } from "../models/QuestionMetadata";

export interface BaseQuestionContent {
  text: string;
}

export interface Question<TContent = BaseQuestionContent> {
  metadata: QuestionMetadata;
  content: TContent;
}
