import React from "react";

export type CalendarGridProps = React.HTMLAttributes<HTMLTableElement>;

export function CalendarGrid({ children, className = "", ...props }: CalendarGridProps) {
  return (
    <table className={`w-full border-collapse space-y-1 ${className}`} {...props}>
      {children}
    </table>
  );
}
