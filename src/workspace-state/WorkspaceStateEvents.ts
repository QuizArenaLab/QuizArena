import { ActiveWorkspaceState } from "./WorkspaceStateTypes";

export type WorkspaceStateEventType =
  | "WorkspaceStateMounted"
  | "WorkspaceStateChanged"
  | "EmptyStateRendered"
  | "LoadingStateRendered"
  | "ErrorStateRendered"
  | "OfflineStateRendered"
  | "PermissionStateRendered"
  | "MaintenanceStateRendered";

export interface WorkspaceStateEventPayloads {
  WorkspaceStateMounted: { timestamp: number };
  WorkspaceStateChanged: {
    previousState: ActiveWorkspaceState;
    newState: ActiveWorkspaceState;
    timestamp: number;
  };
  EmptyStateRendered: { variant: string; timestamp: number };
  LoadingStateRendered: { variant: string; timestamp: number };
  ErrorStateRendered: { variant: string; timestamp: number };
  OfflineStateRendered: { timestamp: number };
  PermissionStateRendered: { variant: string; timestamp: number };
  MaintenanceStateRendered: { variant: string; timestamp: number };
}
