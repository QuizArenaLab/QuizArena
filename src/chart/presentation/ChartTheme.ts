export interface ChartTheme {
  palette: string[];
  grid: { stroke: string; strokeWidth: number; strokeDasharray?: string };
  axis: { stroke: string; strokeWidth: number; tickColor: string; fontSize: number };
  legend: { fontSize: number; textColor: string };
  tooltip: {
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
    borderColor: string;
  };
  radius: number;
  strokeWidth: number;
  animationDuration: number;
  spacing: string;
}

export const defaultChartTheme: ChartTheme = {
  palette: [
    "var(--color-primary)",
    "var(--color-secondary)",
    "var(--color-success)",
    "var(--color-warning)",
    "var(--color-danger)",
    "var(--color-info)",
  ],
  grid: { stroke: "var(--color-border-subtle)", strokeWidth: 1, strokeDasharray: "3 3" },
  axis: {
    stroke: "var(--color-border-default)",
    strokeWidth: 1,
    tickColor: "var(--color-text-secondary)",
    fontSize: 12,
  },
  legend: { fontSize: 12, textColor: "var(--color-text-secondary)" },
  tooltip: {
    backgroundColor: "var(--color-bg-surface)",
    textColor: "var(--color-text-primary)",
    borderRadius: 8,
    borderColor: "var(--color-border-subtle)",
  },
  radius: 4,
  strokeWidth: 2,
  animationDuration: 300,
  spacing: "16px",
};
