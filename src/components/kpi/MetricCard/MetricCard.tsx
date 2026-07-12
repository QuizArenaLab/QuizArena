import React from "react";
import { KPICard, KPICardBody } from "../KPICard";
import { MetricValue } from "../MetricValue";
import { MetricLabel } from "../MetricLabel";
import { Metric } from "../Metric";

export interface MetricCardProps {
  metric: Metric;
  label: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, label, className = "" }) => {
  return (
    <KPICard className={className}>
      <KPICardBody>
        <MetricLabel>{label}</MetricLabel>
        <MetricValue metric={metric} />
      </KPICardBody>
    </KPICard>
  );
};
