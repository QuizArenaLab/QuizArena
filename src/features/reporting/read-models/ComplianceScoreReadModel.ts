export interface ComplianceScoreReadModel {
  overallScore: number;
  components: Record<string, number>;
}
