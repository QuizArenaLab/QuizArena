export interface ResultsReadModel {
  resultId: string;
  summary: any;
  insights: any;
  recommendations: any;
  sections: any;
  explanations: any;
  metadata: {
    generatedAt: Date;
    schemaVersion: string;
  };
}
