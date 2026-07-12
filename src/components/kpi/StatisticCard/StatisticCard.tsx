import React, { ReactNode } from "react";
import { KPICard, KPICardHeader, KPICardBody, KPICardFooter } from "../KPICard";
import { MetricValue } from "../MetricValue";
import { MetricLabel } from "../MetricLabel";
import { MetricDescription } from "../MetricDescription";
import { Statistic } from "../Statistic";
import { TrendIndicator } from "../TrendIndicator";

export interface StatisticCardProps {
  statistic: Statistic;
  actions?: ReactNode;
  className?: string;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  statistic,
  actions,
  className = "",
}) => {
  return (
    <KPICard className={className}>
      <KPICardHeader>
        <MetricLabel>{statistic.label}</MetricLabel>
        {actions && <div>{actions}</div>}
      </KPICardHeader>
      <KPICardBody>
        <div className="flex items-end justify-between w-full">
          <MetricValue metric={statistic.metric} />
          {statistic.trend && <TrendIndicator trend={statistic.trend} />}
        </div>
      </KPICardBody>
      {(statistic.description || statistic.delta) && (
        <KPICardFooter>
          {statistic.description && <MetricDescription>{statistic.description}</MetricDescription>}
        </KPICardFooter>
      )}
    </KPICard>
  );
};
