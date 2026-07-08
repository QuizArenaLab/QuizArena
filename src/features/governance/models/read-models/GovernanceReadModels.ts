export interface CompetitionGovernanceDashboardReadModel {
  totalCompetitions: number;
  drafts: number;
  pendingReview: number;
  approved: number;
  published: number;
  live: number;
  completed: number;
  archived: number;
  failedDeployments: number;
  scheduledToday: number;
  revenueToday: number;
  activeCandidates: number;
  activeIncidents: number;
}

export interface CompetitionHealthReadModel {
  competitionId: string;
  authoringScore: number;
  freezeScore: number;
  deploymentScore: number;
  runtimeScore: number;
  submissionScore: number;
  resultsScore: number;
  leaderboardScore: number;
  revenueScore: number;
  certificatesScore: number;
  notificationsScore: number;
  operationsScore: number;
  platformScore: number;
  overallScore: number; // Aggregated
}

export interface CompetitionTimelineReadModel {
  id: string;
  competitionId: string;
  state: string;
  actor: string;
  timestamp: Date;
  isAudit: boolean;
}

export interface CompetitionApprovalReadModel {
  competitionId: string;
  currentStage: string;
  pendingReviewers: string[];
  checklist: Record<string, boolean>;
  riskScore: number;
}
