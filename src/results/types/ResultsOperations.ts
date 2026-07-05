export interface ResultTimeline {
  events: Array<{
    action: 'Generated' | 'Viewed' | 'Downloaded' | 'Shared' | 'Retaken';
    timestamp: Date;
    actorId?: string;
  }>;
}

export interface ResultMetrics {
  viewCount: number;
  downloadCount: number;
  shareCount: number;
  exportCount: number;
  averageViewTimeSeconds: number;
}

export interface ResultManifest {
  submissionVersion: string;
  evaluationVersion: string;
  artifactVersion: string;
  snapshotVersion: string;
  schemaVersion: string;
}

export interface ResultAudit {
  eventId: string;
  action: string;
  timestamp: Date;
  details: any;
}

export interface ResultsPolicy {
  reviewEnabled: boolean;
  explanationEnabled: boolean;
  leaderboardEnabled: boolean;
  certificatesEnabled: boolean;
  rewardsEnabled: boolean;
  retakeEnabled: boolean;
  sharingEnabled: boolean;
  downloadsEnabled: boolean;
}
