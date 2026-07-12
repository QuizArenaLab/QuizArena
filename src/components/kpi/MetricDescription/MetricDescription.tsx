import React, { ReactNode } from "react";

export interface MetricDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const MetricDescription: React.FC<MetricDescriptionProps> = ({
  children,
  className = "",
}) => {
  return (
    <span
      className={`qa-metric-description block text-xs text-[var(--color-text-subtle)] mt-1 ${className}`}
    >
      {children}
    </span>
  );
};
