export interface FieldManifest {
  id: string;
  name: string;
  category:
    | "text"
    | "number"
    | "phone"
    | "date"
    | "choice"
    | "custom"
    | "time"
    | "datetime"
    | "duration"
    | "timezone";
  variant: string;
  version: string;

  // Capabilities
  supportsValidation: boolean;
  supportsLoading: boolean;
  supportsPrefix: boolean;
  supportsSuffix: boolean;
  supportsCounter: boolean;
}
