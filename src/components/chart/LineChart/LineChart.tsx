import React from "react";
import { ChartFactory } from "../ChartFactory";
import { ChartAdapterProps } from "../../../chart/adapters/ChartAdapter";
import { ChartRegistry } from "../../../chart";
import { createDefaultChartManifest } from "../manifests";

export type LineChartProps = Omit<ChartAdapterProps, "theme">;

export const LineChart: React.FC<LineChartProps> = (props) => {
  return <ChartFactory type="LineChart" {...props} />;
};
