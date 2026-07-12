import React, { ReactNode } from "react";

export interface KPICardActionsProps {
  children: ReactNode;
  className?: string;
}

export const KPICardActions: React.FC<KPICardActionsProps> = ({ children, className = "" }) => {
  return (
    <div className={`qa-kpi-card-actions flex items-center space-x-2 ${className}`}>{children}</div>
  );
};
