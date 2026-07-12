export type ComponentStatus = "experimental" | "stable" | "deprecated" | "legacy";
export type ComponentCategory =
  | "primitives"
  | "navigation"
  | "feedback"
  | "forms"
  | "tables"
  | "charts"
  | "cards"
  | "dashboard"
  | "timeline"
  | "wizard"
  | "search"
  | "filters"
  | "overlays"
  | "loading"
  | "layout"
  | "header"
  | "breadcrumb"
  | "toolbar"
  | "workspace-state"
  | "dashboard-builder"
  | "question"
  | "quiz"
  | "identity";

export interface ComponentDocumentation {
  description: string;
  props?: Record<string, any>;
}

export interface ComponentMetadata {
  id: string;
  name: string;
  category: ComponentCategory;
  subtype?: string;
  version: string;
  status: ComponentStatus;
  owner: string;
  deprecated?: boolean;
  replacedBy?: string; // id of the replacing component
  storybookReference?: string;
  playgroundReference?: string;
  documentationReference?: string;
}
