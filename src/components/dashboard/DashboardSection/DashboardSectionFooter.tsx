import React, { ReactNode } from "react";

export interface DashboardSectionFooterProps {
  children: ReactNode;
  className?: string;
}

export const DashboardSectionFooter: React.FC<DashboardSectionFooterProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`qa-dashboard-section-footer mt-4 pt-4 border-t border-[var(--color-border-subtle)] ${className}`}
    >
      {children}
    </div>
  );
};
