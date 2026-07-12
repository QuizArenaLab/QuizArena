import React, { ReactNode } from "react";

export interface DashboardFooterProps {
  summary?: ReactNode;
  secondary?: ReactNode;
  className?: string;
}

export const DashboardFooter: React.FC<DashboardFooterProps> = ({
  summary,
  secondary,
  className = "",
}) => {
  return (
    <footer
      className={`qa-dashboard-footer w-full py-4 px-4 md:px-8 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] flex items-center justify-between ${className}`}
    >
      <div className="qa-dashboard-footer-summary flex-1">{summary}</div>
      <div className="qa-dashboard-footer-secondary flex-shrink-0">{secondary}</div>
    </footer>
  );
};
