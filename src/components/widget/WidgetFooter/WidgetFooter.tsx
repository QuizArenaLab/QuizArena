import React from "react";
import { useWidget } from "../../../widget";

export interface WidgetFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const WidgetFooter: React.FC<WidgetFooterProps> = ({
  children,
  className = "",
  ...props
}) => {
  const { isCollapsed, manifest } = useWidget();

  if (isCollapsed || !manifest.capabilities.supportsFooter) return null;

  return (
    <div
      className={`px-4 py-3 border-t border-slate-100 bg-slate-50 shrink-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
