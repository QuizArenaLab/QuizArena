import React from "react";
import { ChartFactory } from "../ChartFactory";
import { ChartAdapterProps } from "../../../chart/adapters/ChartAdapter";
import { ChartRegistry } from "../../../chart";
import { createDefaultChartManifest } from "../manifests";

export type BubbleChartProps = Omit<ChartAdapterProps, "theme">;

export const BubbleChart: React.FC<BubbleChartProps> = (props) => {
  return <ChartFactory type="ScatterChart" {...props} />;
};
