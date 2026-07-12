"use client";

import React, { useEffect } from "react";
import { WorkspaceStateProps } from "./WorkspaceState.types";
import { ComponentRegistry } from "@/registry";
import { useWorkspaceState } from "@/providers/WorkspaceStateProvider";
import { EmptyState } from "../EmptyState";
import { LoadingState } from "../LoadingState";
import { ErrorState } from "../ErrorState";
import { OfflineState } from "../OfflineState";
import { PermissionState } from "../PermissionState";
import { MaintenanceState } from "../MaintenanceState";

export function WorkspaceState({
  state,
  emptyProps,
  loadingProps,
  errorProps,
  offlineProps,
  permissionProps,
  maintenanceProps,
  className = "",
  children,
}: WorkspaceStateProps) {
  const { setCurrentState } = useWorkspaceState();

  // Sync the explicitly requested state with the provider context
  // This allows child components nested within children to know the active state if needed,
  // even though they shouldn't render unless we are idle.
  useEffect(() => {
    setCurrentState(state);
  }, [state, setCurrentState]);

  if (state === "loading") {
    return <LoadingState {...loadingProps} className={className} />;
  }

  if (state === "empty") {
    return <EmptyState {...emptyProps} className={className} />;
  }

  if (state === "error") {
    return <ErrorState {...errorProps} className={className} />;
  }

  if (state === "offline") {
    return <OfflineState {...offlineProps} className={className} />;
  }

  if (state === "permission") {
    return <PermissionState {...permissionProps} className={className} />;
  }

  if (state === "maintenance") {
    return <MaintenanceState {...maintenanceProps} className={className} />;
  }

  // idle
  return <div className={`w-full h-full ${className}`}>{children}</div>;
}

ComponentRegistry.register({
  id: "workspace-state",
  name: "WorkspaceState",
  category: "workspace-state" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
