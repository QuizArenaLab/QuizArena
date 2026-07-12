import React from "react";
import { ChartFactory } from "../ChartFactory";
import { ChartAdapterProps } from "../../../chart/adapters/ChartAdapter";
import { ChartRegistry } from "../../../chart";
import { createDefaultChartManifest } from "../manifests";

export type ScatterChartProps = Omit<ChartAdapterProps, "theme">;

export const ScatterChart: React.FC<ScatterChartProps> = (props) => {
  return <ChartFactory type="ScatterChart" {...props} />;
};
