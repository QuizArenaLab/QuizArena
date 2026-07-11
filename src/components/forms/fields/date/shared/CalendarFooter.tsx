import React from "react";

export type CalendarFooterProps = React.HTMLAttributes<HTMLDivElement>;

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
