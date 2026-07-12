import React from "react";
import { useWidget } from "../../../widget";

export interface WidgetActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const WidgetActions: React.FC<WidgetActionsProps> = ({
  children,
  className = "",
  ...props
}) => {
  const { manifest } = useWidget();

  if (!manifest.capabilities.supportsActions) return null;

  return (
    <div className={`flex items-center gap-2 shrink-0 ${className}`} {...props}>
      {children}
    </div>
  );
};
