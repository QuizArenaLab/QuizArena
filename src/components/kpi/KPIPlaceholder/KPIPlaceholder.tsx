import React from "react";
import { KPIStatus } from "../../../kpi/KPIStatus";
import { KPICard } from "../KPICard";

export interface KPIPlaceholderProps {
  status: KPIStatus;
  className?: string;
}

export const KPIPlaceholder: React.FC<KPIPlaceholderProps> = ({ status, className = "" }) => {
  return (
    <KPICard className={className}>
      <div className="flex flex-col items-center justify-center w-full h-full text-center p-4">
        {status === KPIStatus.LOADING && (
          <div className="animate-pulse flex flex-col items-center space-y-4 w-full">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        )}
        {status === KPIStatus.EMPTY && (
          <span className="text-sm text-[var(--color-text-secondary)]">No Data Available</span>
        )}
        {status === KPIStatus.UNAVAILABLE && (
          <span className="text-sm text-[var(--color-text-secondary)]">Metric Unavailable</span>
        )}
        {status === KPIStatus.COMING_SOON && (
          <span className="text-sm text-[var(--color-text-secondary)]">Coming Soon</span>
        )}
        {status === KPIStatus.ERROR && (
          <span className="text-sm text-[var(--color-danger)]">Failed to load</span>
        )}
        {status === KPIStatus.DISABLED && (
          <span className="text-sm text-[var(--color-text-subtle)]">Disabled</span>
        )}
      </div>
    </KPICard>
  );
};
