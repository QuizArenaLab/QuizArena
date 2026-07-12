import React, { ReactNode } from "react";

export interface ChartContainerProps {
  children: ReactNode;
  className?: string;
  minHeight?: number | string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  className = "",
  minHeight = 300,
}) => {
  return (
    <div
      className={`qa-chart-container relative w-full h-full flex flex-col ${className}`}
      style={{ minHeight }}
    >
      {children}
    </div>
  );
};
