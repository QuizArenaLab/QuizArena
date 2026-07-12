import { DashboardLayoutDefinition } from "../types/DashboardLayoutDefinition";
import { DashboardTemplateManifest } from "../registry/DashboardTemplateManifest";

export const ThreeColumnLayoutDefinition: DashboardLayoutDefinition = {
  id: "three-column-layout",
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
      id: "center-zone",
      name: "Center Column",
      placements: [],
    },
    {
      id: "right-zone",
      name: "Right Column",
      placements: [],
    },
  ],
};

export const ThreeColumnLayoutTemplate: DashboardTemplateManifest = {
  id: "template-three-column",
  name: "Three Column Layout",
  description: "A layout split into three equal columns.",
  category: "standard",
  layout: ThreeColumnLayoutDefinition,
};
