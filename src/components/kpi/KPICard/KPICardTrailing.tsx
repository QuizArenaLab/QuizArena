import React, { ReactNode } from "react";

export interface KPICardTrailingProps {
  children: ReactNode;
  className?: string;
}

export const KPICardTrailing: React.FC<KPICardTrailingProps> = ({ children, className = "" }) => {
  return <div className={`qa-kpi-card-trailing flex-shrink-0 ml-3 ${className}`}>{children}</div>;
};
