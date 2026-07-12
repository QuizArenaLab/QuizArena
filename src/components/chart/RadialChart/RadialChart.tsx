import React from "react";
import { ChartFactory } from "../ChartFactory";
import { ChartAdapterProps } from "../../../chart/adapters/ChartAdapter";
import { ChartRegistry } from "../../../chart";
import { createDefaultChartManifest } from "../manifests";

export type RadialChartProps = Omit<ChartAdapterProps, "theme">;

export const RadialChart: React.FC<RadialChartProps> = (props) => {
  return <ChartFactory type="RadialChart" {...props} />;
};
