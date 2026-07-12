import React from "react";
import { WidgetHeader, WidgetBody } from "../index";
import {
  Chart,
  ChartHeader,
  ChartBody,
  LineChart,
  BarChart,
  AreaChart,
  PieChart,
  ScatterChart,
  RadarChart,
} from "../../chart";
import { ChartDataset } from "@/chart/types/ChartDataset";
import { VisualizationOptions } from "@/chart/types/VisualizationOptions";
import { useWidget } from "../../../widget";

export interface ChartWidgetProps {
  data?: ChartDataset;
  options?: VisualizationOptions;
  chartType?: "line" | "bar" | "area" | "pie" | "scatter" | "radar";
}

export const ChartWidget: React.FC<ChartWidgetProps> = ({ data, options, chartType = "line" }) => {
  const { manifest } = useWidget();

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <BarChart dataset={data!} options={options} />;
      case "area":
        return <AreaChart dataset={data!} options={options} />;
      case "pie":
        return <PieChart dataset={data!} options={options} />;
      case "scatter":
        return <ScatterChart dataset={data!} options={options} />;
      case "radar":
        return <RadarChart dataset={data!} options={options} />;
      case "line":
      default:
        return <LineChart dataset={data!} options={options} />;
    }
  };

  return (
    <>
      <WidgetHeader />
      <WidgetBody noPadding>
        <Chart>
          <ChartHeader title={manifest.metadata.name} subtitle={manifest.metadata.description} />
          <ChartBody>
            {data ? (
              renderChart()
            ) : (
              <div className="p-4 text-center text-slate-500">No Chart Data</div>
            )}
          </ChartBody>
        </Chart>
      </WidgetBody>
    </>
  );
};
