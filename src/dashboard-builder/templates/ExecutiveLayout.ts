import { DashboardLayoutDefinition } from "../types/DashboardLayoutDefinition";
import { DashboardTemplateManifest } from "../registry/DashboardTemplateManifest";

export const ExecutiveLayoutDefinition: DashboardLayoutDefinition = {
  id: "executive-layout",
  grid: {
    columns: 12,
    gap: 20,
    rowHeight: "auto",
    breakpoints: { mobile: 1, tablet: 12, desktop: 12 },
  },
  zones: [
    {
      id: "summary-zone",
      name: "Executive Summary",
      placements: [], // Dense high-level metrics
    },
    {
      id: "regional-zone",
      name: "Regional Breakdown",
      placements: [],
    },
    {
      id: "performance-zone",
      name: "Performance Trends",
      placements: [],
    },
  ],
};

export const ExecutiveLayoutTemplate: DashboardTemplateManifest = {
  id: "template-executive",
  name: "Executive Layout",
  description: "A dense high-level overview layout for executives.",
  category: "executive",
  layout: ExecutiveLayoutDefinition,
};
