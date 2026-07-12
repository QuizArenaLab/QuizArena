export type QuestionType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "ASSERTION_REASON"
  | "FILL_BLANK"
  | "NUMERICAL"
  | "PARAGRAPH"
  | "MATCHING"
  | "SEQUENCE"
  | "FORMULA"
  | "MATRIX_MATCH"
  | "HOTSPOT"
  | "DRAG_DROP"
  | "AUDIO"
  | "VIDEO"
  | "PROGRAMMING"
  | "FILE_UPLOAD";

export class QuestionBuilder {
  public async draftQuestion(type: QuestionType, payload: any, authorId: string): Promise<string> {
    // Generates a new Question + V1 QuestionVersion
    return `Q_${Date.now()}`;
  }
}
