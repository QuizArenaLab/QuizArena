import React from "react";
import { WidgetHeader, WidgetBody } from "../index";

export interface ListWidgetProps {
  data?: any;
  options?: any;
  children?: React.ReactNode;
}

export const ListWidget: React.FC<ListWidgetProps> = ({ children }) => {
  return (
    <>
      <WidgetHeader />
      <WidgetBody noPadding>
        {children || (
          <div className="p-4 flex flex-col items-center justify-center text-slate-400 h-full min-h-[150px]">
            List Presentation Shell
          </div>
        )}
      </WidgetBody>
    </>
  );
};
