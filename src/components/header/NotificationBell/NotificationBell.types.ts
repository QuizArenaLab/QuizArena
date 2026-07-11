import React from "react";

export interface NotificationBellProps {
  unreadCount?: number;
  isLoading?: boolean;
  isDisabled?: boolean;
  isEmpty?: boolean;
  className?: string;
}
