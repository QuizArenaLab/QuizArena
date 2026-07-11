import React from "react";

export interface CalendarCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  isToday?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isOutsideMonth?: boolean;
}

export function CalendarCell({
  children,
  isToday,
  isSelected,
  isDisabled,
  isOutsideMonth,
  className = "",
  ...props
}: CalendarCellProps) {
  const baseClasses =
    "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20";

  return (
    <td className={`${baseClasses} ${className}`} {...props}>
      <div
        className={`h-9 w-9 p-0 font-normal flex items-center justify-center rounded-md cursor-pointer
          ${isSelected ? "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white" : ""}
          ${!isSelected && !isDisabled ? "hover:bg-gray-100 hover:text-gray-900" : ""}
          ${isToday ? "bg-gray-100 text-gray-900" : ""}
          ${isDisabled ? "text-gray-400 opacity-50 cursor-not-allowed" : ""}
          ${isOutsideMonth ? "text-gray-400 opacity-50" : ""}
        `}
      >
        {children}
      </div>
    </td>
  );
}
