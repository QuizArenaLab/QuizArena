import { DashboardLayoutDefinition } from "../types/DashboardLayoutDefinition";
import { DashboardTemplateManifest } from "../registry/DashboardTemplateManifest";

export const TwoColumnLayoutDefinition: DashboardLayoutDefinition = {
  id: "two-column-layout",
  grid: {
    columns: 12,
    gap: 16,
    rowHeight: "auto",
    breakpoints: { mobile: 1, tablet: 12, desktop: 12 },
  },
  zones: [
    {
      id: "left-zone",
      name: "Left Column",
      placements: [],
    },
    {
      id: "right-zone",
      name: "Right Column",
      placements: [],
    },
  ],
};

export const TwoColumnLayoutTemplate: DashboardTemplateManifest = {
  id: "template-two-column",
  name: "Two Column Layout",
  description: "A layout split into left and right columns.",
  category: "standard",
  layout: TwoColumnLayoutDefinition,
};
