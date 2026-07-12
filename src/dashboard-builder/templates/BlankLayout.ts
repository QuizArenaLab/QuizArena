import { DashboardLayoutDefinition } from "../types/DashboardLayoutDefinition";
import { DashboardTemplateManifest } from "../registry/DashboardTemplateManifest";

export const BlankLayoutDefinition: DashboardLayoutDefinition = {
  id: "blank-layout",
  grid: {
    columns: 12,
    gap: 16,
    rowHeight: "auto",
    breakpoints: { mobile: 1, tablet: 12, desktop: 12 },
  },
  zones: [], // Empty zones array
};

export const BlankLayoutTemplate: DashboardTemplateManifest = {
  id: "template-blank",
  name: "Blank Layout",
  description: "An empty layout ready to be configured from scratch.",
  category: "blank",
  layout: BlankLayoutDefinition,
};
