export interface ChartSeries {
  dataKey: string;
  name?: string;
  color?: string; // If undefined, will map to ChartTheme.palette by index
  type?: "line" | "monotone" | "step" | "stepBefore" | "stepAfter";
  stackId?: string;
  fillOpacity?: number;
}
