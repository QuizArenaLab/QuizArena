import { ChartSeries } from "./ChartSeries";

export interface ChartBubble extends ChartSeries {
  zDataKey: string; // The data key that determines bubble radius
  zRange?: [number, number];
}
