import React from "react";
import { ChartFactory } from "../ChartFactory";
import { ChartAdapterProps } from "../../../chart/adapters/ChartAdapter";
import { ChartRegistry } from "../../../chart";
import { createDefaultChartManifest } from "../manifests";

export type BarChartProps = Omit<ChartAdapterProps, "theme">;

export const BarChart: React.FC<BarChartProps> = (props) => {
  return <ChartFactory type="BarChart" {...props} />;
};
