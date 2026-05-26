/**
 * QuizArena — Platform Monitoring Type Definitions
 *
 * Enterprise-grade monitoring types for operational reliability.
 * Covers health status, alerts, jobs, activity feeds, and failure inspection.
 */

// ─── OPERATIONAL STATUS ──────────────────────────────────────

export type OperationalStatus = "HEALTHY" | "WARNING" | "CRITICAL" | "OFFLINE";

export interface StatusIndicator {
  status: OperationalStatus;
  label: string;
  message: string;
  lastChecked: Date;
}

// ─── PLATFORM HEALTH ─────────────────────────────────────────

export interface PlatformHealthMetrics {
  activeUsers: number;
  activeSessions: number;
  activeChallenges: number;
  pendingModerationCount: number;
  failedOperationsCount: number;
  totalUsers: number;
  totalChallenges: number;
  totalAttempts: number;
  recentSignups: number;
  overallStatus: OperationalStatus;
  authHealthStatus: OperationalStatus;
  databaseStatus: OperationalStatus;
  apiHealthStatus: OperationalStatus;
}

// ─── BACKGROUND JOB MONITORING ───────────────────────────────

export type JobStatus = "SUCCESS" | "FAILED" | "RUNNING" | "IDLE" | "STALE";

export interface BackgroundJob {
  id: string;
  name: string;
  description: string;
  status: JobStatus;
  lastExecution: Date | null;
  failureCount: number;
  executionLatencyMs: number | null;
  nextScheduled: Date | null;
  category: "publishing" | "expiration" | "moderation" | "analytics" | "maintenance";
}

// ─── SYSTEM ALERTS ───────────────────────────────────────────

export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";
export type AlertCategory =
  | "publishing"
  | "moderation"
  | "authentication"
  | "operations"
  | "security"
  | "performance";

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  timestamp: Date;
  acknowledged: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, string | number>;
}

// ─── FAILURE INSPECTION ──────────────────────────────────────

export type FailureType =
  | "JOB_FAILURE"
  | "SCHEDULING_FAILURE"
  | "MODERATION_ERROR"
  | "AUTH_FAILURE"
  | "OPERATION_ERROR";

export interface FailureRecord {
  id: string;
  type: FailureType;
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  stackTrace?: string;
  metadata: Record<string, string | number>;
}

// ─── ACTIVITY FEED ───────────────────────────────────────────

export type ActivityType =
  | "CHALLENGE_LIVE"
  | "CHALLENGE_ENDED"
  | "CHALLENGE_CREATED"
  | "MODERATION_APPROVED"
  | "MODERATION_REJECTED"
  | "USER_REGISTERED"
  | "USER_SUSPENDED"
  | "ROLE_CHANGED"
  | "JOB_FAILED"
  | "JOB_COMPLETED"
  | "LOGIN_ATTEMPT"
  | "SYSTEM_EVENT";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  actor?: string;
  metadata?: Record<string, string | number>;
}

// ─── MONITORING TRENDS ──────────────────────────────────────

export interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface MonitoringTrend {
  id: string;
  name: string;
  dataPoints: TrendDataPoint[];
  currentValue: number;
  changePercent: number;
  direction: "up" | "down" | "stable";
}

// ─── AGGREGATED MONITORING DATA ─────────────────────────────

export interface MonitoringDashboardData {
  health: PlatformHealthMetrics;
  jobs: BackgroundJob[];
  alerts: SystemAlert[];
  failures: FailureRecord[];
  activityFeed: ActivityEvent[];
  trends: {
    userActivity: TrendDataPoint[];
    attempts: TrendDataPoint[];
    failureRate: TrendDataPoint[];
    moderationThroughput: TrendDataPoint[];
  };
  lastUpdated: Date;
}
