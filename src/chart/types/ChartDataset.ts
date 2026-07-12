import { ChartSeries } from "./ChartSeries";

/**
 * Encapsulates the immutable data contract for all chart types.
 * Purely structural, decoupled from presentation options.
 */
export interface ChartDataset {
  /** The primary series definitions detailing what to plot */
  series: ChartSeries[];
  /** Optional manual labels for categories/axes, if not derived from data keys */
  labels?: string[];
  /** Optional explicit data points overriding series-derived data */
  points?: any[];
  /** Optional categories for ordinal axes */
  categories?: string[];
}
