export interface ResultSnapshotMetadata {
  competitionVersion: string;
  questionVersion: string;
  scoringVersion: string;
  evaluationVersion: string;
  generatedAt: string;
}

export interface QuestionReviewItem {
  questionId: string;
  questionText: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  userAnswerId: string | null;
  correctAnswerId: string | null;
  explanation: string | null;
  marksAwarded: number;
  timeSpentSeconds?: number;
  isCorrect: boolean;
  isSkipped: boolean;
}

export interface SectionMetric {
  sectionId: string;
  sectionName: string;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
  averageTime: number;
  difficulty: string;
  completionRate: number;
}

export interface PerformanceInsight {
  type: "STRONGEST_TOPIC" | "WEAKEST_TOPIC" | "TIME_MANAGEMENT" | "CONSISTENCY";
  title: string;
  description: string;
  metricValue?: string | number;
}

export interface RecommendationAction {
  type: "PRACTICE" | "RETRY" | "READING" | "LEADERBOARD";
  title: string;
  description: string;
  targetUrl?: string;
}

export interface NextAction {
  id: string;
  label: string;
  action: "RETRY_COMPETITION" | "VIEW_LEADERBOARD" | "BROWSE_SIMILAR" | "PRACTICE_WEAK_TOPICS";
  url?: string;
  isPrimary: boolean;
}

export interface CompetitionResultReadModel {
  attemptId: string;
  competitionTitle: string;
  competitionSlug: string;
  
  // Hero / Top Region
  status: "PASSED" | "FAILED" | "COMPLETED"; // Completed if no strict pass criteria
  score: number;
  maxScore: number;
  accuracy: number;
  rank?: number;
  timeTakenInSeconds: number;
  attemptDate: string;
  metadata: ResultSnapshotMetadata;

  // Metrics Region
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  marksAwarded: number;
  negativeMarks: number;
  percentage: number;
  completionRate: number;
  averageTimePerQuestion: number;
  bestSection?: string;
  weakestSection?: string;

  // Review Region
  questionReviews: QuestionReviewItem[];

  // Section Analysis
  sections: SectionMetric[];

  // Insights & Recommendations
  insights: PerformanceInsight[];
  recommendations: RecommendationAction[];
  
  // Action Region
  nextActions: NextAction[];
}
