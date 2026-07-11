import React from "react";
import { dateAdapter } from "../adapter/DateFnsAdapter";

export interface CalendarTodayProps {
  onClick?: (today: Date) => void;
}

export function CalendarToday({ onClick }: CalendarTodayProps) {
  const handleTodayClick = () => {
    if (onClick) {
      onClick(dateAdapter.startOfDay(new Date()));
    }
  };

  return (
    <button
      type="button"
      onClick={handleTodayClick}
      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
    >
      Today
    </button>
  );
}
