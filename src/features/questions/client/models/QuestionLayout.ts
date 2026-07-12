export type QuestionLayoutValue =
  | "STANDARD"
  | "COMPACT"
  | "DETAILED"
  | "REVIEW"
  | "PREVIEW"
  | "PRINT"
  | "MOBILE";

export interface QuestionLayout {
  value: QuestionLayoutValue;
}
