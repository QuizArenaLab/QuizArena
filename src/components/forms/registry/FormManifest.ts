import { FormMetadata } from "./FormMetadata";

export interface FormManifest {
  metadata: FormMetadata;
  lifecycle: string; // Will reference Lifecycle type later
  validationSchema?: any; // Will reference Validation schema later
  themeVersion: string;
  registryVersion: string;
  accessibility: {
    ariaLabels: boolean;
    keyboardNav: boolean;
  };
  responsive: boolean;
  motion: boolean;
}
