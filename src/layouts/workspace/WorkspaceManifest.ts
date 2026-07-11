import { ResponsiveBreakpoint } from "./ResponsiveBreakpoint";

export interface WorkspaceManifest {
  version: string;
  registryVersion: string;
  responsive: ResponsiveBreakpoint[];
  supportsRTL: boolean;
  supportsAccessibility: boolean;

  layoutType: string;
  supportsSidebar: boolean;
  supportsHeader: boolean;
  supportsFooter: boolean;
  supportsToolbar: boolean;
  supportsBreadcrumbs: boolean;
  supportsSearch: boolean;
  supportsFilters: boolean;
}
