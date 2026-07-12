import React from "react";
import { useWidget, WidgetState } from "../../../widget";
import { LoadingState } from "../../workspace-state/LoadingState";
import { EmptyState } from "../../workspace-state/EmptyState";
import { ErrorState } from "../../workspace-state/ErrorState";
import { OfflineState } from "../../workspace-state/OfflineState";
import { PermissionState } from "../../workspace-state/PermissionState";
import { MaintenanceState } from "../../workspace-state/MaintenanceState";

export interface WidgetPlaceholderStateProps {
  className?: string;
  minHeight?: number | string;
}

export const WidgetLoadingState: React.FC<WidgetPlaceholderStateProps> = ({
  className,
  minHeight = "100%",
}) => {
  return (
    <div
      className={`flex items-center justify-center p-4 bg-white ${className}`}
      style={{ minHeight }}
    >
      <LoadingState text="Loading widget..." />
    </div>
  );
};

export const WidgetEmptyState: React.FC<WidgetPlaceholderStateProps> = ({
  className,
  minHeight = "100%",
}) => {
  return (
    <div
      className={`flex items-center justify-center p-4 bg-white ${className}`}
      style={{ minHeight }}
    >
      <EmptyState
        title="No Data Available"
        description="This widget has no data to display currently."
      />
    </div>
  );
};

export const WidgetErrorState: React.FC<WidgetPlaceholderStateProps> = ({
  className,
  minHeight = "100%",
}) => {
  const { onRefresh } = useWidget();
  return (
    <div
      className={`flex items-center justify-center p-4 bg-white ${className}`}
      style={{ minHeight }}
    >
      <ErrorState
        title="Widget Error"
        description="An error occurred while loading this widget."
        onRetry={onRefresh}
      />
    </div>
  );
};

export const WidgetOfflineState: React.FC<WidgetPlaceholderStateProps> = ({
  className,
  minHeight = "100%",
}) => {
  return (
    <div
      className={`flex items-center justify-center p-4 bg-white ${className}`}
      style={{ minHeight }}
    >
      <OfflineState />
    </div>
  );
};

export const WidgetPermissionState: React.FC<WidgetPlaceholderStateProps> = ({
  className,
  minHeight = "100%",
}) => {
  return (
    <div
      className={`flex items-center justify-center p-4 bg-white ${className}`}
      style={{ minHeight }}
    >
      <PermissionState />
    </div>
  );
};

export const WidgetComingSoonState: React.FC<WidgetPlaceholderStateProps> = ({
  className,
  minHeight = "100%",
}) => {
  return (
    <div
      className={`flex items-center justify-center p-4 bg-white ${className}`}
      style={{ minHeight }}
    >
      <MaintenanceState title="Coming Soon" description="This widget is under construction." />
    </div>
  );
};

export const WidgetArchivedState: React.FC<WidgetPlaceholderStateProps> = ({
  className,
  minHeight = "100%",
}) => {
  return (
    <div
      className={`flex items-center justify-center p-4 bg-white opacity-50 ${className}`}
      style={{ minHeight }}
    >
      <div className="text-center">
        <h4 className="text-sm font-semibold text-slate-700">Archived Widget</h4>
        <p className="text-xs text-slate-500">This widget is no longer active.</p>
      </div>
    </div>
  );
};

export const WidgetPlaceholder: React.FC<WidgetPlaceholderStateProps> = (props) => {
  const { state } = useWidget();

  switch (state) {
    case WidgetState.LOADING:
      return <WidgetLoadingState {...props} />;
    case WidgetState.EMPTY:
      return <WidgetEmptyState {...props} />;
    case WidgetState.ERROR:
      return <WidgetErrorState {...props} />;
    case WidgetState.OFFLINE:
      return <WidgetOfflineState {...props} />;
    case WidgetState.PERMISSION:
      return <WidgetPermissionState {...props} />;
    case WidgetState.COMING_SOON:
    case WidgetState.UNAVAILABLE:
      return <WidgetComingSoonState {...props} />;
    case WidgetState.ARCHIVED:
      return <WidgetArchivedState {...props} />;
    default:
      return null;
  }
};
