import React from "react";
import { useWidget } from "../../../widget";

export interface WidgetBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const WidgetBody: React.FC<WidgetBodyProps> = ({
  children,
  noPadding = false,
  className = "",
  ...props
}) => {
  const { isCollapsed } = useWidget();

  if (isCollapsed) return null;

  return (
    <div
      className={`flex-1 overflow-auto bg-white ${noPadding ? "" : "p-4"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
