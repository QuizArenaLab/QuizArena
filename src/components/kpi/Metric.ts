import { MetricFormat } from "../../kpi/MetricFormat";

export interface Metric {
  value: number | string;
  format: MetricFormat;
  prefix?: string;
  suffix?: string;
  customFormatString?: string;
}
