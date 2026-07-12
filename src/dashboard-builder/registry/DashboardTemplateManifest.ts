import { DashboardLayoutDefinition } from "../types/DashboardLayoutDefinition";

export interface DashboardTemplateManifest {
  id: string;
  name: string;
  description: string;
  category: "analytics" | "executive" | "dense" | "standard" | "blank";
  layout: DashboardLayoutDefinition;
}
