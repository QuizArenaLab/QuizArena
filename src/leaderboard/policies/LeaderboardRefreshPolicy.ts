export enum RefreshTrigger {
  IMMEDIATE = 'IMMEDIATE',
  INTERVAL = 'INTERVAL',
  COMPETITION_COMPLETED = 'COMPETITION_COMPLETED',
  MANUAL = 'MANUAL',
  FROZEN = 'FROZEN',
  DISABLED = 'DISABLED'
}

export interface LeaderboardRefreshPolicy {
  trigger: RefreshTrigger;
  intervalSeconds?: number;
}
