import { 
  RecommendationSnapshot, 
  PerformanceInsightSnapshot, 
  SectionPerformanceSnapshot, 
  ExplanationSnapshot 
} from '../../submission/models/PresentationSnapshots';

export interface ResultAggregate {
  resultId: string;
  resultSnapshot: any; // Mapped from SubmissionResult
  recommendationSnapshot: RecommendationSnapshot;
  insightSnapshot: PerformanceInsightSnapshot;
  sectionSnapshot: SectionPerformanceSnapshot;
  explanationSnapshot: ExplanationSnapshot;
  manifest: any; // ResultManifest
  audit: any; // ResultAudit
  timeline: any; // ResultTimeline
}
