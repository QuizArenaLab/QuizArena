export type ChartEventType =
  | "ChartMounted"
  | "ChartRendered"
  | "DataHovered"
  | "DataClicked"
  | "ZoomChanged"
  | "LegendClicked";

export interface ChartEvent<T = any> {
  type: ChartEventType;
  chartId: string;
  timestamp: number;
  payload?: T;
}

export type ChartEventListener = (event: ChartEvent) => void;
