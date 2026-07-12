import React, { ReactNode } from "react";

export interface KPICardFooterProps {
  children: ReactNode;
  className?: string;
}

export const KPICardFooter: React.FC<KPICardFooterProps> = ({ children, className = "" }) => {
  return (
    <footer
      className={`qa-kpi-card-footer w-full mt-4 pt-2 border-t border-[var(--color-border-subtle)] ${className}`}
    >
      {children}
    </footer>
  );
};
