import React from "react";
import { ChartFactory } from "../ChartFactory";
import { ChartAdapterProps } from "../../../chart/adapters/ChartAdapter";
import { ChartRegistry } from "../../../chart";
import { createDefaultChartManifest } from "../manifests";

export type HorizontalBarChartProps = Omit<ChartAdapterProps, "theme">;

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = (props) => {
  return <ChartFactory type="HorizontalBarChart" {...props} />;
};
