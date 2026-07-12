import React from "react";
import { WidgetProvider } from "../../../providers/WidgetProvider";
import { WidgetManifest } from "../../../widget/registry/WidgetManifest";
import { WidgetState } from "../../../widget/presentation/WidgetState";
import { WidgetContainer } from "../WidgetContainer";
import { WidgetRenderer } from "../WidgetRenderer";

export interface WidgetProps {
  manifest: WidgetManifest;
  initialState?: WidgetState;
  onRefresh?: () => void;
  className?: string;
  data?: any;
  options?: any;
  children?: React.ReactNode;
}

export const Widget: React.FC<WidgetProps> = ({
  manifest,
  initialState = WidgetState.READY,
  onRefresh,
  className = "",
  data,
  options,
  children,
}) => {
  return (
    <WidgetProvider manifest={manifest} initialState={initialState} onRefresh={onRefresh}>
      <WidgetContainer className={className}>
        <WidgetRenderer data={data} options={options}>
          {children}
        </WidgetRenderer>
      </WidgetContainer>
    </WidgetProvider>
  );
};
