export type QuestionStatusValue = "draft" | "review" | "published" | "archived" | "rejected";

export interface QuestionStatus {
  value: QuestionStatusValue;
  updatedAt: Date;
  updatedBy: string; // AuthorId
  notes?: string;
}
