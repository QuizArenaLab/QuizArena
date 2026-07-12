import React, { ReactNode } from "react";
import { ComparisonType } from "../../../kpi/KPITypes";

export interface ComparisonBadgeProps {
  type: ComparisonType;
  children: ReactNode;
  className?: string;
}

export const ComparisonBadge: React.FC<ComparisonBadgeProps> = ({
  type,
  children,
  className = "",
}) => {
  return (
    <span
      className={`qa-comparison-badge inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] ${className}`}
      data-comparison-type={type}
    >
      {children}
    </span>
  );
};
