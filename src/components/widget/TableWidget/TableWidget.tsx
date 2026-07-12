import React from "react";
import { WidgetHeader, WidgetBody, WidgetFooter } from "../index";
import { useWidget } from "../../../widget";

export interface TableWidgetProps {
  data?: any;
  options?: any;
  children?: React.ReactNode;
}

export const TableWidget: React.FC<TableWidgetProps> = ({ data, options, children }) => {
  const { manifest } = useWidget();
  return (
    <>
      <WidgetHeader />
      <WidgetBody noPadding>
        {children || (
          <div className="p-4 flex flex-col items-center justify-center text-slate-400 h-full min-h-[200px]">
            Table Presentation Shell
          </div>
        )}
      </WidgetBody>
      {manifest.capabilities.supportsFooter && <WidgetFooter>{options?.footerText}</WidgetFooter>}
    </>
  );
};
