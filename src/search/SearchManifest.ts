export interface SearchManifest {
  id: string;
  version: string;
  registryVersion: string;
  status: "draft" | "active" | "deprecated";
  featureFlag?: string;
  supportsSearch: boolean;
  supportsFilters: boolean;
  supportsSavedFilters: boolean;
  supportsAdvancedFilters: boolean;
  supportsResponsive: boolean;
  supportsAccessibility: boolean;
  supportsEmptyState: boolean;
}
