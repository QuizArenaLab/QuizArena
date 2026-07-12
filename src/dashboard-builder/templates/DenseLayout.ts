import { DashboardLayoutDefinition } from "../types/DashboardLayoutDefinition";
import { DashboardTemplateManifest } from "../registry/DashboardTemplateManifest";

export const DenseLayoutDefinition: DashboardLayoutDefinition = {
  id: "dense-layout",
  grid: {
    columns: 24, // High column count for fine-grained control
    gap: 8, // Very small gap
    rowHeight: 40, // Fixed small row height
    breakpoints: { mobile: 4, tablet: 12, desktop: 24 },
  },
  zones: [
    {
      id: "grid-zone",
      name: "Dense Grid",
      placements: [],
    },
  ],
};

export const DenseLayoutTemplate: DashboardTemplateManifest = {
  id: "template-dense",
  name: "Dense Grid Layout",
  description: "A highly dense layout with 24 columns and minimal spacing.",
  category: "dense",
  layout: DenseLayoutDefinition,
};
