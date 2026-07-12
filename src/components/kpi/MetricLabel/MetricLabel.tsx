import React, { ReactNode } from "react";

export interface MetricLabelProps {
  children: ReactNode;
  className?: string;
}

export const MetricLabel: React.FC<MetricLabelProps> = ({ children, className = "" }) => {
  return (
    <span
      className={`qa-metric-label block text-sm font-medium text-[var(--color-text-secondary)] mb-1 ${className}`}
    >
      {children}
    </span>
  );
};
