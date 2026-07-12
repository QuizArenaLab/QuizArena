import React from "react";
import { ChartPlaceholder } from "../ChartPlaceholder";
import { ChartState } from "../../../chart";

export const FunnelPlaceholder: React.FC<{ className?: string }> = ({ className }) => {
  return <ChartPlaceholder status={ChartState.COMING_SOON} className={className} />;
};
