import React from "react";
import { useWidget } from "../../../widget";

export interface WidgetStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const WidgetStatus: React.FC<WidgetStatusProps> = ({
  children,
  className = "",
  ...props
}) => {
  const { manifest } = useWidget();

  if (!manifest.capabilities.supportsStatus) return null;

  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded shrink-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
