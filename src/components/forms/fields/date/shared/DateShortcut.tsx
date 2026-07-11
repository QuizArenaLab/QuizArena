import React from "react";
import { DateValue } from "../types";

export interface DateShortcutProps {
  label: string;
  value: DateValue;
  onClick: (value: DateValue) => void;
}

export function DateShortcut({ label, value, onClick }: DateShortcutProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className="text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
    >
      {label}
    </button>
  );
}
