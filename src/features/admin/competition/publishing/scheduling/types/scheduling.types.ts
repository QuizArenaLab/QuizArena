export interface CompetitionScheduleInfo {
  publishAt: string | null;
  expiresAt: string | null;
  timezone: string;
  status: ScheduleStatus;
  executedAt: string | null;
  executionLog: string | null;
}

export type ScheduleStatus = "PENDING" | "EXECUTING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface CreateScheduleConfig {
  publishAt?: Date;
  expiresAt?: Date;
  timezone: string;
}
