import React from "react";
import { ChartFactory } from "../ChartFactory";
import { ChartAdapterProps } from "../../../chart/adapters/ChartAdapter";
import { ChartRegistry } from "../../../chart";
import { createDefaultChartManifest } from "../manifests";

export type PieChartProps = Omit<ChartAdapterProps, "theme">;

export const PieChart: React.FC<PieChartProps> = (props) => {
  return <ChartFactory type="PieChart" {...props} />;
};
