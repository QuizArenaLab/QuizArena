export interface DashboardBuilderManifest {
  id: string;
  version: string;
  registryVersion: string;
  status: "stable" | "beta" | "deprecated";
  supportsEdit: boolean;
  supportsResponsive: boolean;
  maxWidgets?: number;
}
