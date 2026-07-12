import React, { ReactNode } from "react";
import { ChartProvider } from "../../../providers/ChartProvider";
import { ChartPresentationContextValue } from "../../../chart/presentation/ChartPresentationContext";

export interface ChartProps {
  presentation?: Partial<ChartPresentationContextValue>;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export const Chart: React.FC<ChartProps> = ({
  presentation,
  children,
  className = "",
  ariaLabel,
}) => {
  return (
    <ChartProvider presentation={presentation}>
      <div
        className={`qa-chart flex flex-col bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-4 shadow-sm w-full h-full overflow-hidden ${className}`}
        role="region"
        aria-label={ariaLabel || "Chart"}
      >
        {children}
      </div>
    </ChartProvider>
  );
};
