export interface WorkspaceStateManifest {
  id: string;
  version: string;
  registryVersion: string;
  status: "stable" | "beta" | "deprecated";
  responsive: boolean;
  accessibility: boolean;
  supportsLoading: boolean;
  supportsEmpty: boolean;
  supportsError: boolean;
  supportsOffline: boolean;
  supportsPermission: boolean;
  supportsMaintenance: boolean;
  supportsSkeleton: boolean;
}
