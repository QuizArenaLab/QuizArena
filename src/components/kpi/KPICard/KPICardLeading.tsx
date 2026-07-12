import React, { ReactNode } from "react";

export interface KPICardLeadingProps {
  children: ReactNode;
  className?: string;
}

export const KPICardLeading: React.FC<KPICardLeadingProps> = ({ children, className = "" }) => {
  return <div className={`qa-kpi-card-leading flex-shrink-0 mr-3 ${className}`}>{children}</div>;
};
