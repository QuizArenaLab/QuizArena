import { DashboardLayoutDefinition } from "../types/DashboardLayoutDefinition";
import { DashboardTemplateManifest } from "../registry/DashboardTemplateManifest";

export const AnalyticsLayoutDefinition: DashboardLayoutDefinition = {
  id: "analytics-layout",
  grid: {
    columns: 12,
    gap: 24,
    rowHeight: "auto",
    breakpoints: { mobile: 1, tablet: 12, desktop: 12 },
  },
  zones: [
    {
      id: "hero-zone",
      name: "Hero KPIs",
      placements: [], // Typically 4 KPI cards taking 3 cols each
    },
    {
      id: "main-charts-zone",
      name: "Main Charts",
      placements: [], // Typically 2 large charts taking 6 cols each
    },
    {
      id: "details-zone",
      name: "Details Tables",
      placements: [], // Typically full width tables
    },
  ],
};

export const AnalyticsLayoutTemplate: DashboardTemplateManifest = {
  id: "template-analytics",
  name: "Analytics Layout",
  description:
    "A layout designed for analytics with a hero KPI section followed by charts and details.",
  category: "analytics",
  layout: AnalyticsLayoutDefinition,
};
