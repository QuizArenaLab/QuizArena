export interface QuestionDashboardReadModel {
  totalQuestions: number;
  certifiedQuestions: number;
  averageHealthScore: number;
}

export interface QuestionBuilderReadModel {
  draftId: string;
  allowedTypes: string[];
}

export interface QuestionCertificationReadModel {
  questionId: string;
  version: string;
  certificationStatus: string;
  certifiedBy: string;
}

export interface QuestionBlueprintReadModel {
  blueprintId: string;
  name: string;
  rules: any[];
}

export interface QuestionAssetReadModel {
  assetId: string;
  type: string;
  url: string;
}

export interface QuestionReviewQueueReadModel {
  reviewId: string;
  questionId: string;
  assignedTo: string;
  status: string;
}

export interface QuestionAnalyticsReadModel {
  questionId: string;
  difficulty: string;
  successRate: string;
}

export interface QuestionUsageReadModel {
  questionId: string;
  timesUsed: number;
  revenueGenerated: number;
}
