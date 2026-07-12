export interface ChartTooltip {
  formatter?: (value: any, name: string, props: any) => [string, string];
  labelFormatter?: (label: any) => string;
  hide?: boolean;
}
