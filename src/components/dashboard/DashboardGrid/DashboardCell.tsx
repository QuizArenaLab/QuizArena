import React, { ReactNode } from "react";

export interface DashboardCellProps {
  span?: number;
  rowSpan?: number;
  x?: number; // Future drag and drop metadata
  y?: number;
  w?: number;
  h?: number;
  children: ReactNode;
  className?: string;
}

export const DashboardCell: React.FC<DashboardCellProps> = ({
  span,
  rowSpan,
  x,
  y,
  w,
  h,
  children,
  className = "",
}) => {
  const colSpan = w || span || 1;
  const rSpan = h || rowSpan || 1;

  return (
    <div
      className={`qa-dashboard-cell ${className}`}
      style={{
        gridColumn:
          x !== undefined ? `${x + 1} / span ${colSpan}` : `span ${colSpan} / span ${colSpan}`,
        gridRow: y !== undefined ? `${y + 1} / span ${rSpan}` : `span ${rSpan} / span ${rSpan}`,
      }}
    >
      {children}
    </div>
  );
};
