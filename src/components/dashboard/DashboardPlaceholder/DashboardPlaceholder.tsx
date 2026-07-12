import React, { ReactNode } from "react";

export interface DashboardPlaceholderProps {
  illustration?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const DashboardPlaceholder: React.FC<DashboardPlaceholderProps> = ({
  illustration,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`qa-dashboard-placeholder flex flex-col items-center justify-center w-full h-full p-8 text-center bg-[var(--color-bg-surface)] border border-dashed border-[var(--color-border-default)] rounded-[var(--radius-lg)] ${className}`}
    >
      {illustration && <div className="mb-6 text-[var(--color-icon-disabled)]">{illustration}</div>}
      <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-md">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
