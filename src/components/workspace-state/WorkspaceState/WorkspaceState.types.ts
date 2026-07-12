import { ActiveWorkspaceState } from "@/workspace-state";
import { EmptyStateProps } from "../EmptyState";
import { LoadingStateProps } from "../LoadingState";
import { ErrorStateProps } from "../ErrorState";
import { OfflineStateProps } from "../OfflineState";
import { PermissionStateProps } from "../PermissionState";
import { MaintenanceStateProps } from "../MaintenanceState";

export interface WorkspaceStateProps {
  state: ActiveWorkspaceState;

  // Specific props to pass through based on the active state
  emptyProps?: EmptyStateProps;
  loadingProps?: LoadingStateProps;
  errorProps?: ErrorStateProps;
  offlineProps?: OfflineStateProps;
  permissionProps?: PermissionStateProps;
  maintenanceProps?: MaintenanceStateProps;

  className?: string;
  children?: React.ReactNode; // What to render if state === "idle"
}
