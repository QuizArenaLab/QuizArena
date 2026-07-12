import React from "react";
import { ChartTooltip as ChartTooltipType } from "../../../chart";

export interface ChartTooltipProps extends ChartTooltipType {
  className?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  formatter,
  labelFormatter,
  hide,
  className = "",
}) => {
  // Purely a configuration slot, does not render anything on its own.
  // The ChartRenderer consumes this prop.
  return null;
};
