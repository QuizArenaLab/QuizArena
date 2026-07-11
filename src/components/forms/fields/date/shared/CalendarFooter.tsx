import React from "react";

export interface CalendarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CalendarFooter({ children, className = "", ...props }: CalendarFooterProps) {
  return (
    <div
      className={`pt-2 border-t border-gray-100 flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
