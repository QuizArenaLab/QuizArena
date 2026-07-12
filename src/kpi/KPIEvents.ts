export type KPIEventType = "KPIMounted" | "KPIRendered" | "TrendRendered" | "ComparisonRendered";

export interface KPIEvent<T = any> {
  type: KPIEventType;
  kpiId: string;
  timestamp: number;
  payload?: T;
}

export type KPIEventListener = (event: KPIEvent) => void;
