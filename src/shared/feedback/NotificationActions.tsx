"use client";

import React from "react";
import { NotificationAction } from "@/shared/types/feedback";

interface NotificationActionsProps {
  action: NotificationAction;
  onDismiss: () => void;
}

export function NotificationActions({ action, onDismiss }: NotificationActionsProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    action.onClick();
    onDismiss();
  };

  return (
    <div className="mt-3">
      <button
        onClick={handleClick}
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-900 w-full sm:w-auto"
        aria-label={action.label}
      >
        {action.label}
      </button>
    </div>
  );
}
