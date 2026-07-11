export interface FormAnalyticsReadModel {
  formId: string;
  completionRate: number;
  averageTime: number;
  dropoffRate: number;
  totalErrors: number;
  totalWarnings: number;
  successRate: number;
  abandonmentRate: number;
}
