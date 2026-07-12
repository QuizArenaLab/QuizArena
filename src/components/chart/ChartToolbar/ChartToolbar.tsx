import React, { ReactNode } from "react";

export interface ChartToolbarProps {
  children: ReactNode;
  className?: string;
}

export const ChartToolbar: React.FC<ChartToolbarProps> = ({ children, className = "" }) => {
  return (
    <div className={`qa-chart-toolbar flex items-center space-x-2 ${className}`}>{children}</div>
  );
};
