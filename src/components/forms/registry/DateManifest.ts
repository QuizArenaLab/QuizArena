import { DateCapabilities } from "./DateCapabilities";
import { FieldManifest } from "./FieldManifest";

export interface DateManifest extends Omit<FieldManifest, "category"> {
  category: "date" | "time" | "datetime" | "duration" | "timezone";
  capabilities: DateCapabilities;
  owner: string;
  accessibility: {
    ariaLabels: boolean;
    keyboardNav: boolean;
  };
  responsive: boolean;
  registryVersion: string;
}
