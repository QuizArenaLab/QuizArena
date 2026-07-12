import React, { ReactNode } from "react";

export interface DashboardHeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  actionsSlot?: ReactNode;
  className?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  leading,
  trailing,
  actionsSlot,
  className = "",
}) => {
  return (
    <header
      className={`qa-dashboard-header flex items-center justify-between w-full py-6 px-4 md:px-8 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] ${className}`}
    >
      <div className="flex items-center space-x-4">
        {leading && <div className="qa-dashboard-header-leading flex-shrink-0">{leading}</div>}
        <div className="flex flex-col">
          {title && (
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{title}</h1>
          )}
          {subtitle && (
            <h2 className="text-sm text-[var(--color-text-secondary)] mt-1">{subtitle}</h2>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {trailing && <div className="qa-dashboard-header-trailing">{trailing}</div>}
        {actionsSlot && <div className="qa-dashboard-header-actions">{actionsSlot}</div>}
      </div>
    </header>
  );
};
