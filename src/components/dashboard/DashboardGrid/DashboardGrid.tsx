import React, { ReactNode } from "react";
import { useDashboardContext } from "../../../dashboard/DashboardContext";

export interface DashboardGridProps {
  children: ReactNode;
  className?: string;
  columns?: number;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  className = "",
  columns,
}) => {
  const { layout } = useDashboardContext();
  const activeColumns = columns || layout.columns;
  const gap = layout.spacing;

  return (
    <div
      className={`qa-dashboard-grid w-full ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${activeColumns}, minmax(0, 1fr))`,
        gap: gap,
      }}
    >
      {children}
    </div>
  );
};
