export type DashboardEventType =
  | "DashboardMounted"
  | "DashboardUpdated"
  | "DashboardLayoutChanged"
  | "DashboardSectionRendered"
  | "DashboardGridRendered";

export interface DashboardEvent<T = any> {
  type: DashboardEventType;
  dashboardId: string;
  timestamp: number;
  payload?: T;
}

export type DashboardEventListener = (event: DashboardEvent) => void;
