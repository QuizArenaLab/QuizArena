import React from "react";

export interface CalendarLegendItem {
  colorClass: string;
  label: string;
}

export interface CalendarLegendProps {
  items: CalendarLegendItem[];
}

export function CalendarLegend({ items }: CalendarLegendProps) {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${item.colorClass}`} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
