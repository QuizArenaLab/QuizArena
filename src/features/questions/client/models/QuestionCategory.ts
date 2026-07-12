export interface QuestionCategory {
  id: string;
  name: string;
  parentId?: string;
  path: string[];
}
