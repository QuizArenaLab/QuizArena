import React, { ReactNode } from "react";

export interface MetricFooterProps {
  children: ReactNode;
  className?: string;
}

export const MetricFooter: React.FC<MetricFooterProps> = ({ children, className = "" }) => {
  return <div className={`qa-metric-footer mt-auto pt-4 ${className}`}>{children}</div>;
};
