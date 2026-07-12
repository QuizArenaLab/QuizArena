import { DashboardLayoutDefinition } from "../types/DashboardLayoutDefinition";
import { DashboardTemplateManifest } from "../registry/DashboardTemplateManifest";

export const SingleColumnLayoutDefinition: DashboardLayoutDefinition = {
  id: "single-column-layout",
  grid: {
    columns: 12,
    gap: 16,
    rowHeight: "auto",
    breakpoints: { mobile: 1, tablet: 12, desktop: 12 },
  },
  zones: [
    {
      id: "main-zone",
      name: "Main Zone",
      placements: [],
    },
  ],
};

export const SingleColumnLayoutTemplate: DashboardTemplateManifest = {
  id: "template-single-column",
  name: "Single Column Layout",
  description: "A simple full-width layout with a single zone.",
  category: "standard",
  layout: SingleColumnLayoutDefinition,
};
