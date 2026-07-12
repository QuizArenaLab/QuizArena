import React, { ReactNode } from "react";
import { useDashboardContext } from "../../../dashboard/DashboardContext";

export interface DashboardContainerProps {
  children: ReactNode;
  className?: string;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({
  children,
  className = "",
}) => {
  const { layout } = useDashboardContext();

  return (
    <div
      className={`qa-dashboard-container w-full h-full flex flex-col mx-auto ${className}`}
      style={{
        maxWidth: layout.maxWidth,
        padding: layout.spacing,
      }}
    >
      {children}
    </div>
  );
};
