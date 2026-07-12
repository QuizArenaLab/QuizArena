import React from "react";
import { WidgetHeader, WidgetBody } from "../index";

export interface ActivityWidgetProps {
  data?: any;
  options?: any;
  children?: React.ReactNode;
}

export const ActivityWidget: React.FC<ActivityWidgetProps> = ({ children }) => {
  return (
    <>
      <WidgetHeader />
      <WidgetBody>
        {children || (
          <div className="flex flex-col items-center justify-center text-slate-400 h-full min-h-[200px]">
            Activity Presentation Shell
          </div>
        )}
      </WidgetBody>
    </>
  );
};
