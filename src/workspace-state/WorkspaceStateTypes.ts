export type ActiveWorkspaceState =
  | "idle"
  | "empty"
  | "loading"
  | "error"
  | "offline"
  | "permission"
  | "maintenance";

export type EmptyStateVariant =
  | "no-data"
  | "no-results"
  | "first-time"
  | "search-empty"
  | "filter-empty"
  | "workspace-empty"
  | "coming-soon"
  | "archived";
export type LoadingStateVariant =
  | "spinner"
  | "skeleton"
  | "card"
  | "table"
  | "dashboard"
  | "fullscreen"
  | "inline";
export type ErrorStateVariant =
  | "generic"
  | "network"
  | "unknown"
  | "workspace"
  | "permission-placeholder";
export type PermissionStateVariant = "restricted" | "read-only" | "hidden" | "unavailable";
export type MaintenanceStateVariant = "scheduled" | "temporary" | "read-only" | "upgrade";
