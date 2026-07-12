import React from "react";
import { WidgetHeader, WidgetBody, WidgetFooter } from "../index";
import { useWidget } from "../../../widget";

export interface SummaryWidgetProps {
  data?: any;
  options?: any;
  children?: React.ReactNode;
}

export const SummaryWidget: React.FC<SummaryWidgetProps> = ({ data, options, children }) => {
  const { manifest } = useWidget();
  return (
    <>
      <WidgetHeader />
      <WidgetBody>
        <div className="flex flex-col gap-4">
          {children || (
            <div className="text-sm text-slate-500">Summary visualization goes here</div>
          )}
        </div>
      </WidgetBody>
      {manifest.capabilities.supportsFooter && <WidgetFooter>{options?.footerText}</WidgetFooter>}
    </>
  );
};
