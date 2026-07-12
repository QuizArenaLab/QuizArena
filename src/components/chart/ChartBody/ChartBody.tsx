import React, { ReactNode } from "react";

export interface ChartBodyProps {
  children: ReactNode;
  className?: string;
}

export const ChartBody: React.FC<ChartBodyProps> = ({ children, className = "" }) => {
  return (
    <div className={`qa-chart-body flex-1 w-full min-h-0 relative ${className}`}>{children}</div>
  );
};
