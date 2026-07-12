export interface QuestionVersion {
  versionId: string;
  versionNumber: number;
  createdAt: Date;
  parentVersionId?: string; // For tracking history
  isLatest: boolean;
}
