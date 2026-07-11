export interface HeaderManifest {
  id: string;
  title: string;
  subtitle?: string;
  version: string;
  registryVersion: string;
  status: "stable" | "beta" | "deprecated";
  featureFlag?: string;
  supportsRTL: boolean;
  supportsAccessibility: boolean;
  supportsTitle: boolean;
  supportsSubtitle: boolean;
  supportsActions: boolean;
  supportsProfile: boolean;
  supportsWorkspaceSwitcher: boolean;
  supportsNotifications: boolean;
}
