import React, { ReactNode } from "react";

export interface KPICardBodyProps {
  children: ReactNode;
  className?: string;
}

export const KPICardBody: React.FC<KPICardBodyProps> = ({ children, className = "" }) => {
  return (
    <div className={`qa-kpi-card-body flex-1 w-full flex flex-col justify-center ${className}`}>
      {children}
    </div>
  );
};
