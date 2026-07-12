export type QuestionEventType =
  | "QUESTION_MOUNTED"
  | "QUESTION_UNMOUNTED"
  | "QUESTION_STATE_CHANGE"
  | "QUESTION_INTERACTION";

export interface QuestionEvent {
  type: QuestionEventType;
  questionId?: string;
  timestamp: number;
  payload?: any;
}
