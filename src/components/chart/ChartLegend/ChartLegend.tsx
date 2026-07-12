import React from "react";
import { ChartLegend as ChartLegendType } from "../../../chart";

export interface ChartLegendProps extends ChartLegendType {
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  layout,
  align,
  verticalAlign,
  hide,
  className = "",
}) => {
  // Purely a configuration slot, does not render anything on its own.
  // The ChartRenderer consumes this prop.
  return null;
};
