import React from "react";
import { ChartDataset } from "../types/ChartDataset";
import { VisualizationOptions } from "../types/VisualizationOptions";
import { ChartLayout } from "../types/ChartLayout";
import { ChartTheme } from "../presentation/ChartTheme";

export interface ChartAdapterProps {
  dataset: ChartDataset;
  options?: VisualizationOptions;
  layout?: ChartLayout;
  theme?: ChartTheme;
  height?: number | string;
  width?: number | string;
  children?: React.ReactNode;
}

export interface ChartAdapter {
  LineChart: React.FC<ChartAdapterProps>;
  AreaChart: React.FC<ChartAdapterProps>;
  BarChart: React.FC<ChartAdapterProps>;
  StackedBarChart: React.FC<ChartAdapterProps>;
  HorizontalBarChart: React.FC<ChartAdapterProps>;
  PieChart: React.FC<ChartAdapterProps>;
  DonutChart: React.FC<ChartAdapterProps>;
  RadarChart: React.FC<ChartAdapterProps>;
  RadialChart: React.FC<ChartAdapterProps>;
  ScatterChart: React.FC<ChartAdapterProps>;
}
