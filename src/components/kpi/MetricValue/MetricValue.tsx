import React from "react";
import { Metric } from "../Metric";
import { MetricFormat } from "../../../kpi/MetricFormat";

export interface MetricValueProps {
  metric: Metric;
  className?: string;
}

export const MetricValue: React.FC<MetricValueProps> = ({ metric, className = "" }) => {
  // A simplistic formatting implementation for presentation purposes only
  let displayValue = String(metric.value);

  if (metric.format === MetricFormat.PERCENT && typeof metric.value === "number") {
    displayValue = `${(metric.value * 100).toFixed(1)}`;
  } else if (metric.format === MetricFormat.CURRENCY && typeof metric.value === "number") {
    displayValue = metric.value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <span
      className={`qa-metric-value text-3xl font-bold text-[var(--color-text-primary)] ${className}`}
    >
      {metric.prefix && (
        <span className="qa-metric-prefix mr-1 text-xl opacity-70">{metric.prefix}</span>
      )}
      {displayValue}
      {metric.suffix && (
        <span className="qa-metric-suffix ml-1 text-xl opacity-70">{metric.suffix}</span>
      )}
    </span>
  );
};
