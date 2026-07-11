import React from "react";

export interface NavigationGroupProps {
  id: string;
  title?: string;
  description?: string;
  icon?: string;
  expanded?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
}
