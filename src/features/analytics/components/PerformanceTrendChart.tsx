"use client";

import { useMemo, useState } from "react";

interface TrendPoint {
  date: string;
  accuracy: number;
}

interface PerformanceTrendChartProps {
  data: TrendPoint[];
}

export function PerformanceTrendChart({ data }: PerformanceTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartConfig = useMemo(() => {
    if (data.length < 2) return null;

    const width = 600;
    const height = 180; // Taller for professional analysis
    const paddingX = 40; // More padding for Y-axis labels
    const paddingY = 20;
    const paddingBottom = 30; // Padding for X-axis labels

    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY - paddingBottom;

    const maxVal = 100;
    const minVal = 0;
    const range = maxVal - minVal;

    const points = data.map((d, i) => ({
      x: paddingX + (i / (data.length - 1)) * chartWidth,
      y: paddingY + ((maxVal - d.accuracy) / range) * chartHeight,
      accuracy: d.accuracy,
      date: new Date(d.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    }));

    // Build strict straight line path (Discrete data points shouldn't be curved)
    let linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i].x} ${points[i].y}`;
    }

    // Grid lines every 25% for professional readability
    const gridLines = [0, 25, 50, 75, 100].map((val) => ({
      y: paddingY + ((maxVal - val) / range) * chartHeight,
      label: `${val}%`,
    }));

    return {
      width,
      height,
      points,
      linePath,
      gridLines,
      paddingX,
      paddingY,
      chartHeight,
      paddingBottom,
    };
  }, [data]);

  if (!chartConfig) {
    return null;
  }

  const { width, height, points, linePath, gridLines, paddingY, chartHeight } = chartConfig;

  return (
    <div className="w-full overflow-visible py-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y-Axis Grid lines & Labels */}
        {gridLines.map((g, i) => (
          <g key={`grid-${i}`}>
            <line x1={35} y1={g.y} x2={width - 20} y2={g.y} stroke="#e5e7eb" strokeWidth="1" />
            <text
              x={30}
              y={g.y + 3}
              fill="#6b7280"
              fontSize="10"
              fontFamily="inherit"
              textAnchor="end"
            >
              {g.label}
            </text>
          </g>
        ))}

        {/* X-Axis Base Line */}
        <line
          x1={35}
          y1={paddingY + chartHeight}
          x2={width - 20}
          y2={paddingY + chartHeight}
          stroke="#d1d5db"
          strokeWidth="1.5"
        />

        {/* X-Axis Labels (Show first, last, and middle if enough points to prevent crowding) */}
        {points.map((p, i) => {
          const showLabel =
            i === 0 || i === points.length - 1 || i === Math.floor(points.length / 2);
          if (!showLabel) return null;

          return (
            <text
              key={`x-label-${i}`}
              x={p.x}
              y={paddingY + chartHeight + 16}
              fill="#6b7280"
              fontSize="10"
              fontFamily="inherit"
              textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
            >
              {p.date}
            </text>
          );
        })}

        {/* Sharp, analytical line */}
        <path
          d={linePath}
          fill="none"
          stroke="#1b2234" // Dark Navy (Match Hero)
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive Data Points & Hover States */}
        {points.map((point, i) => (
          <g key={`point-${i}`}>
            {/* Vertical crosshair on hover */}
            {hoveredIndex === i && (
              <line
                x1={point.x}
                y1={paddingY}
                x2={point.x}
                y2={paddingY + chartHeight}
                stroke="#9ca3af"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="pointer-events-none"
              />
            )}

            {/* Solid dots for actual attempts */}
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === i ? 4.5 : 3}
              fill={hoveredIndex === i ? "#1b2234" : "white"}
              stroke="#1b2234"
              strokeWidth="2"
              className="pointer-events-none transition-all duration-100"
            />

            {/* Invisible large hover area */}
            <circle
              cx={point.x}
              cy={point.y}
              r="24"
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: "crosshair" }}
            />

            {/* Professional Tooltip */}
            {hoveredIndex === i && (
              <g className="pointer-events-none">
                <rect
                  x={point.x - 45}
                  y={point.y - 45}
                  width="90"
                  height="34"
                  rx="4"
                  fill="white"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={point.x}
                  y={point.y - 29}
                  textAnchor="middle"
                  fill="#111827"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="inherit"
                >
                  {point.accuracy}%
                </text>
                <text
                  x={point.x}
                  y={point.y - 17}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="10"
                  fontFamily="inherit"
                >
                  {point.date}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
