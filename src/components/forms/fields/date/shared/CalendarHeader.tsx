import React from "react";

export interface CalendarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CalendarHeader({ children, className = "", ...props }: CalendarHeaderProps) {
  return (
    <div className={`flex items-center justify-between pt-1 ${className}`} {...props}>
      {children}
    </div>
  );
}
