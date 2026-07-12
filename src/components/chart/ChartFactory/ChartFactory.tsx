import React from "react";
import { ChartEngine, ChartEngineProps } from "../ChartEngine";

export type ChartFactoryProps = ChartEngineProps;

/**
 * ChartFactory determines which ChartEngine to instantiate.
 * Currently it directly wraps ChartEngine, but this abstraction allows future routing
 * to different engines based on environment (e.g. Dashboard Widgets vs Embedded Reports).
 */
export const ChartFactory: React.FC<ChartFactoryProps> = (props) => {
  return <ChartEngine {...props} />;
};
