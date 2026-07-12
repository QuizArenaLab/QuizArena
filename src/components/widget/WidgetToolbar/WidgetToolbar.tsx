import React from "react";
import { useWidget } from "../../../widget";

export interface WidgetToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const WidgetToolbar: React.FC<WidgetToolbarProps> = ({
  children,
  className = "",
  ...props
}) => {
  const { isCollapsed, manifest } = useWidget();

  if (isCollapsed || !manifest.capabilities.supportsToolbar) return null;

  return (
    <div
      className={`px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 shrink-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
