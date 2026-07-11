import React from "react";

export interface CalendarWeekNumberProps {
  weekNumber: number;
}

export function CalendarWeekNumber({ weekNumber }: CalendarWeekNumberProps) {
  return (
    <td className="text-xs text-gray-400 font-medium text-center align-middle w-8 border-r border-gray-100 mr-1">
      {weekNumber}
    </td>
  );
}
