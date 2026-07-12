import React, { ReactNode } from "react";

export interface ChartFooterProps {
  children: ReactNode;
  className?: string;
}

export const ChartFooter: React.FC<ChartFooterProps> = ({ children, className = "" }) => {
  return (
    <footer
      className={`qa-chart-footer w-full mt-4 pt-4 border-t border-[var(--color-border-subtle)] ${className}`}
    >
      {children}
    </footer>
  );
};
