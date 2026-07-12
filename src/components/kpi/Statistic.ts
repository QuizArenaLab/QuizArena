import { Metric } from "./Metric";
import { KPITrend } from "../../kpi/KPITrend";

export interface Statistic {
  metric: Metric;
  label: string;
  description?: string;
  trend?: KPITrend;
  delta?: Metric;
}
