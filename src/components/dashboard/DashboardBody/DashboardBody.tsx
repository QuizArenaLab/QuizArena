import React, { ReactNode } from "react";

export interface DashboardBodyProps {
  children: ReactNode;
  className?: string;
}

export const DashboardBody: React.FC<DashboardBodyProps> = ({ children, className = "" }) => {
  return (
    <main className={`qa-dashboard-body flex-1 w-full overflow-hidden ${className}`}>
      {children}
    </main>
  );
};
