import React from "react";

export interface CalendarRootProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CalendarRoot({ children, className = "", ...props }: CalendarRootProps) {
  return (
    <div
      className={`flex flex-col space-y-4 p-3 bg-white rounded-md border border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
