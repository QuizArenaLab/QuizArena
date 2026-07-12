import React from "react";
import { ChartFactory } from "../ChartFactory";
import { ChartAdapterProps } from "../../../chart/adapters/ChartAdapter";
import { ChartRegistry } from "../../../chart";
import { createDefaultChartManifest } from "../manifests";

export type AreaChartProps = Omit<ChartAdapterProps, "theme">;

export const AreaChart: React.FC<AreaChartProps> = (props) => {
  return <ChartFactory type="AreaChart" {...props} />;
};
