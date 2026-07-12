import React, { ReactNode } from "react";

export interface DashboardSectionBodyProps {
  children: ReactNode;
  className?: string;
}

export const DashboardSectionBody: React.FC<DashboardSectionBodyProps> = ({
  children,
  className = "",
}) => {
  return <div className={`qa-dashboard-section-body flex-1 w-full ${className}`}>{children}</div>;
};
