import React from "react";
import { RechartsAdapter } from "../../../chart/adapters/RechartsAdapter";
import { ChartAdapterProps } from "../../../chart/adapters/ChartAdapter";
import { useChartPresentationContext } from "../../../chart/presentation/ChartPresentationContext";

export interface ChartEngineProps extends Omit<ChartAdapterProps, "theme"> {
  type: keyof typeof RechartsAdapter;
}

export const ChartEngine: React.FC<ChartEngineProps> = ({ type, ...props }) => {
  const { theme } = useChartPresentationContext();
  const ChartComponent = RechartsAdapter[type];

  if (!ChartComponent) {
    return <div className="text-red-500">Invalid Chart Type: {type}</div>;
  }

  return <ChartComponent {...props} theme={theme} />;
};
