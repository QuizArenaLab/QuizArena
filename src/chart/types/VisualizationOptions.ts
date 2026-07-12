import { ChartLegend } from "./ChartLegend";
import { ChartTooltip } from "./ChartTooltip";
import { ChartAxis } from "./ChartAxis";
import { ChartAnimation } from "../presentation/ChartAnimation";
import { ChartInteractionMode } from "../presentation/ChartInteractionMode";
import { ChartTheme } from "../presentation/ChartTheme";

/**
 * Encapsulates all presentation-oriented configuration for a chart.
 * Contains zero business data.
 */
export interface VisualizationOptions {
  legend?: ChartLegend;
  tooltip?: ChartTooltip;
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  animation?: ChartAnimation;
  palette?: string[];
  interaction?: ChartInteractionMode;
  themeOverrides?: Partial<ChartTheme>;
}
