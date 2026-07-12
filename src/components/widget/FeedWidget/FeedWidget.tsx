import React from "react";
import { WidgetHeader, WidgetBody } from "../index";

export interface FeedWidgetProps {
  data?: any;
  options?: any;
  children?: React.ReactNode;
}

export const FeedWidget: React.FC<FeedWidgetProps> = ({ children }) => {
  return (
    <>
      <WidgetHeader />
      <WidgetBody noPadding>
        {children || (
          <div className="p-4 flex flex-col items-center justify-center text-slate-400 h-full min-h-[300px]">
            Feed Presentation Shell
          </div>
        )}
      </WidgetBody>
    </>
  );
};
