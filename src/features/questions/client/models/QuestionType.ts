export type QuestionTypeValue =
  | "MCQ"
  | "MSQ"
  | "TrueFalse"
  | "FillBlank"
  | "MatchFollowing"
  | "Sequence"
  | "AssertionReason"
  | "Numerical"
  | "Subjective"
  | "Coding"
  | "CaseStudy"
  | "Comprehension";

export interface QuestionType {
  value: QuestionTypeValue;
}
