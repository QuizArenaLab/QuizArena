import React from "react";
import {
  LineChart as ReLineChart,
  Line,
  AreaChart as ReAreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  RadarChart as ReRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart as ReRadialBarChart,
  RadialBar,
  ScatterChart as ReScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartAdapter, ChartAdapterProps } from "./ChartAdapter";
import { defaultChartTheme } from "../presentation/ChartTheme";

// Helper for generating colors
const getColor = (index: number, color?: string, theme = defaultChartTheme) => {
  if (color) return color;
  return theme.palette[index % theme.palette.length];
};

const GenericLineChart: React.FC<ChartAdapterProps> = ({
  dataset,
  options = {},
  theme = defaultChartTheme,
  height = 300,
}) => {
  const { series, points = [] } = dataset;
  const { xAxis, yAxis, legend, tooltip } = options;
  return (
    <ResponsiveContainer width="100%" height={height as any}>
      <ReLineChart data={points}>
        <CartesianGrid
          strokeDasharray={theme.grid.strokeDasharray}
          stroke={theme.grid.stroke}
          vertical={false}
        />
        {!xAxis?.hide && (
          <XAxis
            dataKey={xAxis?.dataKey}
            stroke={theme.axis.stroke}
            tick={{ fill: theme.axis.tickColor, fontSize: theme.axis.fontSize }}
          />
        )}
        {!yAxis?.hide && (
          <YAxis
            stroke={theme.axis.stroke}
            tick={{ fill: theme.axis.tickColor, fontSize: theme.axis.fontSize }}
          />
        )}
        {!tooltip?.hide && (
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltip.backgroundColor,
              borderRadius: theme.tooltip.borderRadius,
              borderColor: theme.tooltip.borderColor,
            }}
          />
        )}
        {!legend?.hide && (
          <Legend
            wrapperStyle={{ fontSize: theme.legend.fontSize, color: theme.legend.textColor }}
          />
        )}
        {series.map((s, i) => (
          <Line
            key={s.dataKey}
            type={(s.type as any) || "monotone"}
            dataKey={s.dataKey}
            name={s.name}
            stroke={getColor(i, s.color, theme)}
            strokeWidth={theme.strokeWidth}
            dot={{ r: theme.radius }}
            activeDot={{ r: theme.radius + 2 }}
          />
        ))}
      </ReLineChart>
    </ResponsiveContainer>
  );
};

const GenericAreaChart: React.FC<ChartAdapterProps> = ({
  dataset,
  options = {},
  theme = defaultChartTheme,
  height = 300,
}) => {
  const { series, points = [] } = dataset;
  const { xAxis, yAxis, legend, tooltip } = options;
  return (
    <ResponsiveContainer width="100%" height={height as any}>
      <ReAreaChart data={points}>
        <CartesianGrid
          strokeDasharray={theme.grid.strokeDasharray}
          stroke={theme.grid.stroke}
          vertical={false}
        />
        {!xAxis?.hide && (
          <XAxis
            dataKey={xAxis?.dataKey}
            stroke={theme.axis.stroke}
            tick={{ fill: theme.axis.tickColor, fontSize: theme.axis.fontSize }}
          />
        )}
        {!yAxis?.hide && (
          <YAxis
            stroke={theme.axis.stroke}
            tick={{ fill: theme.axis.tickColor, fontSize: theme.axis.fontSize }}
          />
        )}
        {!tooltip?.hide && (
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltip.backgroundColor,
              borderRadius: theme.tooltip.borderRadius,
              borderColor: theme.tooltip.borderColor,
            }}
          />
        )}
        {!legend?.hide && (
          <Legend
            wrapperStyle={{ fontSize: theme.legend.fontSize, color: theme.legend.textColor }}
          />
        )}
        {series.map((s, i) => (
          <Area
            key={s.dataKey}
            type={(s.type as any) || "monotone"}
            dataKey={s.dataKey}
            name={s.name}
            stroke={getColor(i, s.color, theme)}
            fill={getColor(i, s.color, theme)}
            fillOpacity={s.fillOpacity || 0.3}
            strokeWidth={theme.strokeWidth}
          />
        ))}
      </ReAreaChart>
    </ResponsiveContainer>
  );
};

const GenericBarChart: React.FC<
  ChartAdapterProps & { stacked?: boolean; chartLayout?: "horizontal" | "vertical" }
> = ({
  dataset,
  options = {},
  theme = defaultChartTheme,
  height = 300,
  stacked = false,
  chartLayout = "horizontal",
}) => {
  const { series, points = [] } = dataset;
  const { xAxis, yAxis, legend, tooltip } = options;
  return (
    <ResponsiveContainer width="100%" height={height as any}>
      <ReBarChart data={points} layout={chartLayout}>
        <CartesianGrid
          strokeDasharray={theme.grid.strokeDasharray}
          stroke={theme.grid.stroke}
          vertical={chartLayout === "horizontal"}
          horizontal={chartLayout === "vertical"}
        />
        {!xAxis?.hide && (
          <XAxis
            dataKey={chartLayout === "horizontal" ? xAxis?.dataKey : undefined}
            type={chartLayout === "horizontal" ? "category" : "number"}
            stroke={theme.axis.stroke}
            tick={{ fill: theme.axis.tickColor, fontSize: theme.axis.fontSize }}
          />
        )}
        {!yAxis?.hide && (
          <YAxis
            dataKey={chartLayout === "vertical" ? yAxis?.dataKey : undefined}
            type={chartLayout === "vertical" ? "category" : "number"}
            stroke={theme.axis.stroke}
            tick={{ fill: theme.axis.tickColor, fontSize: theme.axis.fontSize }}
          />
        )}
        {!tooltip?.hide && (
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltip.backgroundColor,
              borderRadius: theme.tooltip.borderRadius,
              borderColor: theme.tooltip.borderColor,
            }}
          />
        )}
        {!legend?.hide && (
          <Legend
            wrapperStyle={{ fontSize: theme.legend.fontSize, color: theme.legend.textColor }}
          />
        )}
        {series.map((s, i) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.name}
            stackId={stacked ? "a" : undefined}
            fill={getColor(i, s.color, theme)}
            radius={stacked ? 0 : [theme.radius, theme.radius, 0, 0]}
          />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  );
};

const GenericPieChart: React.FC<ChartAdapterProps & { donut?: boolean }> = ({
  dataset,
  options = {},
  theme = defaultChartTheme,
  height = 300,
  donut = false,
}) => {
  const { series, points = [] } = dataset;
  const { legend, tooltip } = options;
  const primarySeries = series[0];
  if (!primarySeries) return null;

  return (
    <ResponsiveContainer width="100%" height={height as any}>
      <RePieChart>
        {!tooltip?.hide && (
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltip.backgroundColor,
              borderRadius: theme.tooltip.borderRadius,
              borderColor: theme.tooltip.borderColor,
            }}
          />
        )}
        {!legend?.hide && (
          <Legend
            wrapperStyle={{ fontSize: theme.legend.fontSize, color: theme.legend.textColor }}
          />
        )}
        <Pie
          data={points}
          dataKey={primarySeries.dataKey}
          nameKey="name" // Assumes data has a 'name' field for segments
          cx="50%"
          cy="50%"
          innerRadius={donut ? "60%" : 0}
          outerRadius="80%"
          fill={theme.palette[0]}
          paddingAngle={donut ? 2 : 0}
        >
          {points.map((_, index) => (
            <Cell key={`cell-${index}`} fill={theme.palette[index % theme.palette.length]} />
          ))}
        </Pie>
      </RePieChart>
    </ResponsiveContainer>
  );
};

const GenericRadarChart: React.FC<ChartAdapterProps> = ({
  dataset,
  options = {},
  theme = defaultChartTheme,
  height = 300,
}) => {
  const { series, points = [] } = dataset;
  const { xAxis, legend, tooltip } = options;
  return (
    <ResponsiveContainer width="100%" height={height as any}>
      <ReRadarChart data={points}>
        <PolarGrid stroke={theme.grid.stroke} />
        <PolarAngleAxis
          dataKey={xAxis?.dataKey || "subject"}
          tick={{ fill: theme.axis.tickColor, fontSize: theme.axis.fontSize }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, "auto"]}
          tick={{ fill: theme.axis.tickColor, fontSize: theme.axis.fontSize }}
        />
        {!tooltip?.hide && (
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltip.backgroundColor,
              borderRadius: theme.tooltip.borderRadius,
              borderColor: theme.tooltip.borderColor,
            }}
          />
        )}
        {!legend?.hide && (
          <Legend
            wrapperStyle={{ fontSize: theme.legend.fontSize, color: theme.legend.textColor }}
          />
        )}
        {series.map((s, i) => (
          <Radar
            key={s.dataKey}
            name={s.name}
            dataKey={s.dataKey}
            stroke={getColor(i, s.color, theme)}
            fill={getColor(i, s.color, theme)}
            fillOpacity={s.fillOpacity || 0.6}
          />
        ))}
      </ReRadarChart>
    </ResponsiveContainer>
  );
};

const GenericRadialChart: React.FC<ChartAdapterProps> = ({
  dataset,
  options = {},
  theme = defaultChartTheme,
  height = 300,
}) => {
  const { series, points = [] } = dataset;
  const { legend, tooltip } = options;
  return (
    <ResponsiveContainer width="100%" height={height as any}>
      <ReRadialBarChart innerRadius="10%" outerRadius="80%" data={points}>
        {!tooltip?.hide && (
          <Tooltip
            contentStyle={{
              backgroundColor: theme.tooltip.backgroundColor,
              borderRadius: theme.tooltip.borderRadius,
              borderColor: theme.tooltip.borderColor,
            }}
          />
        )}
        {!legend?.hide && (
          <Legend
            wrapperStyle={{ fontSize: theme.legend.fontSize, color: theme.legend.textColor }}
          />
        )}
        {series.map((s, i) => (
          <RadialBar
            key={s.dataKey}
            background
            dataKey={s.dataKey}
            fill={getColor(i, s.color, theme)}
          />
        ))}
      </ReRadialBarChart>
    </ResponsiveContainer>
  );
};

const GenericScatterChart: React.FC<ChartAdapterProps> = ({
  dataset,
  options = {},
  theme = defaultChartTheme,
  height = 300,
}) => {
  const { series, points = [] } = dataset;
  const { xAxis, yAxis, legend, tooltip } = options;
  return (
    <ResponsiveContainer width="100%" height={height as any}>
      <ReScatterChart>
        <CartesianGrid strokeDasharray={theme.grid.strokeDasharray} stroke={theme.grid.stroke} />
        <XAxis
          type="number"
          dataKey={xAxis?.dataKey}
          name={xAxis?.label || xAxis?.dataKey}
          stroke={theme.axis.stroke}
          tick={{ fill: theme.axis.tickColor, fontSize: theme.axis.fontSize }}
        />
        <YAxis
          type="number"
          dataKey={yAxis?.dataKey}
          name={yAxis?.label || yAxis?.dataKey}
          stroke={theme.axis.stroke}
          tick={{ fill: theme.axis.tickColor, fontSize: theme.axis.fontSize }}
        />
        {!tooltip?.hide && (
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: theme.tooltip.backgroundColor,
              borderRadius: theme.tooltip.borderRadius,
              borderColor: theme.tooltip.borderColor,
            }}
          />
        )}
        {!legend?.hide && (
          <Legend
            wrapperStyle={{ fontSize: theme.legend.fontSize, color: theme.legend.textColor }}
          />
        )}
        {series.map((s, i) => (
          <Scatter
            key={s.dataKey}
            name={s.name || s.dataKey}
            data={points}
            fill={getColor(i, s.color, theme)}
          />
        ))}
      </ReScatterChart>
    </ResponsiveContainer>
  );
};

export const RechartsAdapter: ChartAdapter = {
  LineChart: GenericLineChart,
  AreaChart: GenericAreaChart,
  BarChart: (props) => <GenericBarChart {...props} />,
  StackedBarChart: (props) => <GenericBarChart {...props} stacked />,
  HorizontalBarChart: (props) => <GenericBarChart {...props} chartLayout="vertical" />,
  PieChart: (props) => <GenericPieChart {...props} />,
  DonutChart: (props) => <GenericPieChart {...props} donut />,
  RadarChart: GenericRadarChart,
  RadialChart: GenericRadialChart,
  ScatterChart: GenericScatterChart,
};
