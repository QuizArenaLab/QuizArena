import React from "react";
import { SparklineVariant } from "../../../kpi/KPITypes";

export interface SparklinePlaceholderProps {
  points?: number[];
  variant?: SparklineVariant;
  color?: string;
  height?: number;
  width?: number | string;
  className?: string;
}

export const SparklinePlaceholder: React.FC<SparklinePlaceholderProps> = ({
  points = [],
  variant = SparklineVariant.LINE,
  color = "var(--color-primary)",
  height = 40,
  width = "100%",
  className = "",
}) => {
  // A simplistic visual representation of a sparkline for placeholder purposes.
  // In FS-03.3 this will be replaced with real chart rendering.

  return (
    <div
      className={`qa-sparkline-placeholder flex items-end justify-between ${className}`}
      style={{ height, width }}
      aria-hidden="true"
    >
      {points.length > 0 ? (
        points.map((p, i) => (
          <div
            key={i}
            style={{
              height: `${Math.max(10, Math.min(100, p))}%`,
              width: variant === SparklineVariant.BAR ? "4px" : "2px",
              backgroundColor: color,
              opacity: 0.5 + (i / points.length) * 0.5,
              borderRadius: variant === SparklineVariant.BAR ? "2px" : "0",
            }}
          />
        ))
      ) : (
        <div className="w-full h-full bg-[var(--color-bg-subtle)] opacity-50 rounded" />
      )}
    </div>
  );
};
