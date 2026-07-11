import React from "react";
import { DateValue } from "../types";
import { dateAdapter } from "../adapter/DateFnsAdapter";

export interface CalendarSelectionProps {
  value: DateValue;
  formatStr?: string;
}

export function CalendarSelection({ value, formatStr = "PPP" }: CalendarSelectionProps) {
  if (!value) return null;

  const renderValue = () => {
    if (Array.isArray(value)) {
      return `${value.length} dates selected`;
    }
    if (typeof value === "object" && "from" in value) {
      const range = value as { from?: Date; to?: Date };
      if (range.from && range.to) {
        return `${dateAdapter.formatDate(range.from, formatStr)} - ${dateAdapter.formatDate(range.to, formatStr)}`;
      }
      if (range.from) return `${dateAdapter.formatDate(range.from, formatStr)} - ...`;
      return "No dates selected";
    }
    return dateAdapter.formatDate(value as Date, formatStr);
  };

  return <div className="text-sm font-medium text-gray-900">{renderValue()}</div>;
}
