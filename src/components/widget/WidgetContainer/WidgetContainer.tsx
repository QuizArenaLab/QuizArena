import React from "react";
import { useWidget } from "../../../widget";

export interface WidgetContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  children,
  className = "",
  ...props
}) => {
  const { isCollapsed } = useWidget();

  return (
    <div
      className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${isCollapsed ? "h-[60px]" : "h-full"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
