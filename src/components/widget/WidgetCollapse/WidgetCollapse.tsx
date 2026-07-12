import React from "react";
import { useWidget } from "../../../widget";

export interface WidgetCollapseProps {
  children: React.ReactNode;
}

export const WidgetCollapse: React.FC<WidgetCollapseProps> = ({ children }) => {
  const { isCollapsed } = useWidget();

  if (isCollapsed) return null;

  return <>{children}</>;
};
