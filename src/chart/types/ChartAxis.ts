export interface ChartAxis {
  dataKey?: string;
  hide?: boolean;
  tickFormatter?: (value: any) => string;
  domain?: [number | string, number | string];
  orientation?: "left" | "right" | "top" | "bottom";
  label?: string;
}
