import React, { ReactNode } from "react";
import { KPITrend, TrendVariant } from "../../../kpi/KPITrend";

export interface TrendIndicatorProps {
  trend: KPITrend;
  variant?: TrendVariant;
  className?: string;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  trend,
  variant = TrendVariant.ARROW,
  className = "",
}) => {
  const getColorClass = () => {
    switch (trend) {
      case KPITrend.UP:
        return "text-[var(--color-success)]";
      case KPITrend.DOWN:
        return "text-[var(--color-danger)]";
      case KPITrend.NEUTRAL:
        return "text-[var(--color-text-secondary)]";
      case KPITrend.UNKNOWN:
      default:
        return "text-[var(--color-text-subtle)]";
    }
  };

  const renderIcon = (): ReactNode => {
    // A primitive icon implementation for presentation purposes
    if (variant === TrendVariant.ARROW) {
      if (trend === KPITrend.UP) return "↑";
      if (trend === KPITrend.DOWN) return "↓";
      if (trend === KPITrend.NEUTRAL) return "→";
      return "-";
    }
    if (variant === TrendVariant.CHEVRON) {
      if (trend === KPITrend.UP) return "▲";
      if (trend === KPITrend.DOWN) return "▼";
      if (trend === KPITrend.NEUTRAL) return "▶";
      return "-";
    }
    if (variant === TrendVariant.DOT) {
      return "●";
    }
    return "-"; // Fallback for other variants
  };

  return (
    <span
      className={`qa-trend-indicator inline-flex items-center font-medium ${getColorClass()} ${className}`}
    >
      {renderIcon()}
    </span>
  );
};
