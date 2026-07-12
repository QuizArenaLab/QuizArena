import React, { ReactNode } from "react";
import { useDashboardContext } from "../../../dashboard/DashboardContext";

export interface DashboardLayoutProps {
  header?: ReactNode;
  grid?: ReactNode;
  footer?: ReactNode;
  leftAside?: ReactNode;
  rightAside?: ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  header,
  grid,
  footer,
  leftAside,
  rightAside,
  className = "",
}) => {
  const { layout } = useDashboardContext();

  // In the future, leftAside and rightAside will be rendered here.
  // For now, they are silently ignored to maintain a stable API contract while focusing on core composition.
  if (leftAside) console.warn("DashboardLayout: leftAside is not yet supported.");
  if (rightAside) console.warn("DashboardLayout: rightAside is not yet supported.");

  return (
    <div
      className={`qa-dashboard-layout flex flex-col flex-1 w-full max-w-[${layout.maxWidth}] mx-auto ${className}`}
    >
      {header && <div className="qa-dashboard-layout-header w-full flex-shrink-0">{header}</div>}
      {grid && (
        <div
          className="qa-dashboard-layout-grid w-full flex-1 min-h-0 overflow-y-auto"
          style={{ padding: layout.spacing }}
        >
          {grid}
        </div>
      )}
      {footer && <div className="qa-dashboard-layout-footer w-full flex-shrink-0">{footer}</div>}
    </div>
  );
};
