import React from "react";
import { ChartFactory } from "../ChartFactory";
import { ChartAdapterProps } from "../../../chart/adapters/ChartAdapter";
import { ChartRegistry } from "../../../chart";
import { createDefaultChartManifest } from "../manifests";

export type StackedBarChartProps = Omit<ChartAdapterProps, "theme">;

export const StackedBarChart: React.FC<StackedBarChartProps> = (props) => {
  return <ChartFactory type="StackedBarChart" {...props} />;
};
