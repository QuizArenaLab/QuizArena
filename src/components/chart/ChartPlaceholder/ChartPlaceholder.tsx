import React from "react";
import { Chart } from "../Chart";
import { ChartState } from "../../../chart";

export interface ChartPlaceholderProps {
  status: ChartState;
  className?: string;
  minHeight?: number | string;
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({
  status,
  className = "",
  minHeight = 300,
}) => {
  return (
    <Chart className={className}>
      <div
        className="flex flex-col items-center justify-center w-full h-full text-center p-4"
        style={{ minHeight }}
      >
        {status === ChartState.LOADING && (
          <div className="animate-pulse flex flex-col items-center space-y-4 w-full h-full justify-center">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="flex items-end justify-center space-x-2 w-full h-1/2">
              <div className="w-1/6 bg-gray-200 rounded h-1/4"></div>
              <div className="w-1/6 bg-gray-200 rounded h-1/2"></div>
              <div className="w-1/6 bg-gray-200 rounded h-full"></div>
              <div className="w-1/6 bg-gray-200 rounded h-3/4"></div>
            </div>
            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
          </div>
        )}
        {status === ChartState.EMPTY && (
          <span className="text-sm text-[var(--color-text-secondary)]">No Data Available</span>
        )}
        {status === ChartState.UNAVAILABLE && (
          <span className="text-sm text-[var(--color-text-secondary)]">Chart Unavailable</span>
        )}
        {status === ChartState.COMING_SOON && (
          <span className="text-sm text-[var(--color-text-secondary)]">Coming Soon</span>
        )}
        {status === ChartState.ERROR && (
          <span className="text-sm text-[var(--color-danger)]">Failed to load chart</span>
        )}
      </div>
    </Chart>
  );
};
