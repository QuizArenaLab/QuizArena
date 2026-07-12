import React, { ReactNode } from "react";

export interface KPICardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const KPICardHeader: React.FC<KPICardHeaderProps> = ({ children, className = "" }) => {
  return (
    <header
      className={`qa-kpi-card-header flex items-center justify-between w-full mb-2 ${className}`}
    >
      {children}
    </header>
  );
};
