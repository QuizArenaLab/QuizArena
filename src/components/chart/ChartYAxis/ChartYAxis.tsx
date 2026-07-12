import React from "react";
import { ChartAxis } from "../../../chart";

export interface ChartYAxisProps extends ChartAxis {
  className?: string;
}

export const ChartYAxis: React.FC<ChartYAxisProps> = ({
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
