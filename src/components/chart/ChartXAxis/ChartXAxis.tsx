import React from "react";
import { ChartAxis } from "../../../chart";

export interface ChartXAxisProps extends ChartAxis {
  className?: string;
}

export const ChartXAxis: React.FC<ChartXAxisProps> = ({
  dataKey,
  hide,
  tickFormatter,
  domain,
  orientation,
  label,
  className = "",
}) => {
  return null;
};
