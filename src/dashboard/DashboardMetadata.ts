export interface DashboardMetadata {
  id: string;
  name: string;
  description: string;
  owner: string;
  version: string;
  registryVersion: string;
  status: "draft" | "active" | "deprecated" | "archived";
}
