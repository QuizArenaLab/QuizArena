import React, { ReactNode } from "react";

export interface ChartHeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({
  title,
  subtitle,
  children,
  className = "",
}) => {
  return (
    <header
      className={`qa-chart-header flex flex-col sm:flex-row sm:items-center justify-between w-full mb-4 gap-2 ${className}`}
    >
      <div className="flex flex-col">
        {title && (
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
        )}
        {subtitle && <span className="text-sm text-[var(--color-text-secondary)]">{subtitle}</span>}
      </div>
      {children && <div className="flex items-center shrink-0">{children}</div>}
    </header>
  );
};
