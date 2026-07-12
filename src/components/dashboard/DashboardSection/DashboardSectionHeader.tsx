import React, { ReactNode } from "react";

export interface DashboardSectionHeaderProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const DashboardSectionHeader: React.FC<DashboardSectionHeaderProps> = ({
  title,
  description,
  actions,
  className = "",
}) => {
  return (
    <div
      className={`qa-dashboard-section-header flex justify-between items-start mb-4 ${className}`}
    >
      <div className="flex flex-col">
        {title && (
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  );
};
