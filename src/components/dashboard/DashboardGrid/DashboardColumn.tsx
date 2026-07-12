import React, { ReactNode } from "react";

export interface DashboardColumnProps {
  span?: number | { base: number; md?: number; lg?: number; xl?: number };
  children: ReactNode;
  className?: string;
}

export const DashboardColumn: React.FC<DashboardColumnProps> = ({
  span = 1,
  children,
  className = "",
}) => {
  // A simplistic approach to span. In a real application, you'd translate the object to responsive Tailwind classes
  // or inline CSS custom properties. For this foundation, we focus on the base span for static inline styles
  // or let Tailwind classes handle responsiveness.
  const baseSpan = typeof span === "number" ? span : span.base;

  return (
    <div
      className={`qa-dashboard-column flex flex-col ${className}`}
      style={{
        gridColumn: `span ${baseSpan} / span ${baseSpan}`,
      }}
    >
      {children}
    </div>
  );
};
