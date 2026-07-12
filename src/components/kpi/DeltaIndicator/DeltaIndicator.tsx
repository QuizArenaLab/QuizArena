import React from "react";
import { Metric } from "../Metric";
import { MetricValue } from "../MetricValue";

export interface DeltaIndicatorProps {
  delta: Metric;
  isPositiveGood?: boolean;
  className?: string;
}

export const DeltaIndicator: React.FC<DeltaIndicatorProps> = ({
  delta,
  isPositiveGood = true,
  className = "",
}) => {
  const numericValue = Number(delta.value);
  const isPositive = numericValue > 0;
  const isZero = numericValue === 0;

  let colorClass = "text-[var(--color-text-secondary)]";
  if (!isZero) {
    if (isPositive) {
      colorClass = isPositiveGood ? "text-[var(--color-success)]" : "text-[var(--color-danger)]";
    } else {
      colorClass = isPositiveGood ? "text-[var(--color-danger)]" : "text-[var(--color-success)]";
    }
  }

  return (
    <div
      className={`qa-delta-indicator inline-flex items-center text-sm font-medium ${colorClass} ${className}`}
    >
      {isPositive && !isZero && <span className="mr-1">+</span>}
      <MetricValue metric={delta} className="!text-sm" />
    </div>
  );
};
