import React, { ReactNode } from "react";
import { useDashboardContext } from "../../../dashboard/DashboardContext";

export interface DashboardRowProps {
  children: ReactNode;
  className?: string;
}

export const DashboardRow: React.FC<DashboardRowProps> = ({ children, className = "" }) => {
  const { layout } = useDashboardContext();

  return (
    <div
      className={`qa-dashboard-row col-span-full grid w-full ${className}`}
      style={{
        gridTemplateColumns: "inherit",
        gap: layout.spacing,
      }}
    >
      {children}
    </div>
  );
};
