import React, { ReactNode } from "react";

export interface ChartActionsProps {
  children: ReactNode;
  className?: string;
}

export const ChartActions: React.FC<ChartActionsProps> = ({ children, className = "" }) => {
  return <div className={`qa-chart-actions flex items-center gap-2 ${className}`}>{children}</div>;
};
