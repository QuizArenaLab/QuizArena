"use client";

import React from "react";
import { NotificationBellProps } from "./NotificationBell.types";
import { ComponentRegistry } from "@/registry";
import { Icon } from "@/icons/Icon";

export function NotificationBell({
  unreadCount = 0,
  isLoading = false,
  isDisabled = false,
  isEmpty = false,
  className = "",
}: NotificationBellProps) {
  const hasUnread = unreadCount > 0;

  return (
    <button
      className={`relative p-2 rounded-full transition-colors flex items-center justify-center ${
        isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"
      } ${className}`}
      disabled={isDisabled}
      aria-label="Notifications"
      aria-haspopup="true"
    >
      <Icon name="Bell" className="w-5 h-5 text-gray-600" />

      {isLoading ? (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gray-300 rounded-full animate-pulse border border-white" />
      ) : hasUnread ? (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : isEmpty ? (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gray-300 rounded-full border border-white hidden" /> // Intentionally hidden when empty/read
      ) : null}
    </button>
  );
}

ComponentRegistry.register({
  id: "notification-bell",
  name: "NotificationBell",
  category: "header",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
