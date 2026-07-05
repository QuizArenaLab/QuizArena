export interface RuntimeMetrics {
  navigationCount: number;
  answerChanges: number;
  autosaveCount: number;
  recoveryCount: number;
  connectionDrops: number;
  syncLatencyMs: number;
  sessionDurationSeconds: number;
}

export interface RuntimeAudit {
  eventId: string;
  eventType: 'Started' | 'Recovered' | 'Paused' | 'Resumed' | 'Submitted' | 'Expired' | 'Disconnected';
  timestamp: Date;
  details: any;
}

export interface RuntimeManifest {
  artifactVersion: string;
  runtimeVersion: string;
  schemaVersion: string;
  featureFlags: RuntimeFeatureFlags;
  configurationVersion: string;
}

export interface RuntimeReadModel {
  sessionId: string;
  state: string;
  metrics: RuntimeMetrics;
  lastUpdated: Date;
}

export interface RuntimePolicy {
  autosaveIntervalMs: number;
  recoveryWindowMs: number;
  heartbeatIntervalMs: number;
  expiryBufferMs: number;
  navigationRules: any;
}

export interface RuntimeFeatureFlags {
  offlineMode: boolean;
  recoveryEnabled: boolean;
  autosaveEnabled: boolean;
  reviewEnabled: boolean;
  pauseEnabled: boolean;
}
