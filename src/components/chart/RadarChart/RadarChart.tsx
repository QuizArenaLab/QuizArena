import React from "react";
import { ChartFactory } from "../ChartFactory";
import { ChartAdapterProps } from "../../../chart/adapters/ChartAdapter";
import { ChartRegistry } from "../../../chart";
import { createDefaultChartManifest } from "../manifests";

export type RadarChartProps = Omit<ChartAdapterProps, "theme">;

export const RadarChart: React.FC<RadarChartProps> = (props) => {
  return <ChartFactory type="RadarChart" {...props} />;
};
