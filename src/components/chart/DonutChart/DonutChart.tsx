import React from "react";
import { ChartFactory } from "../ChartFactory";
import { ChartAdapterProps } from "../../../chart/adapters/ChartAdapter";
import { ChartRegistry } from "../../../chart";
import { createDefaultChartManifest } from "../manifests";

export type DonutChartProps = Omit<ChartAdapterProps, "theme">;

export const DonutChart: React.FC<DonutChartProps> = (props) => {
  return <ChartFactory type="DonutChart" {...props} />;
};
