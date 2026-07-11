import React from "react";

export interface CalendarOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function CalendarOverlay({ isVisible, message = "Loading..." }: CalendarOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-md">
      <div className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded shadow-sm">
        {message}
      </div>
    </div>
  );
}
