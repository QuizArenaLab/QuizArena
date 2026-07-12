export type QuestionMediaTypeValue =
  | "IMAGE"
  | "VIDEO"
  | "AUDIO"
  | "TABLE"
  | "LATEX"
  | "CODE"
  | "PDF"
  | "ATTACHMENT";

export interface QuestionMediaType {
  value: QuestionMediaTypeValue;
}
