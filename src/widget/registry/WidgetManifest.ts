import { WidgetCapabilities } from "./WidgetCapabilities";
import { WidgetCategory } from "../types/WidgetCategory";
import { WidgetSize } from "../presentation/WidgetSize";

export interface WidgetLayoutMetadata {
  minWidth: number;
  minHeight: number;
  defaultColumns: number;
  defaultRows: number;
  preferredAspectRatio: number;
  allowResize: boolean;
  allowCollapse: boolean;
  allowFullscreen: boolean;
}

export interface WidgetMetadata {
  id: string;
  name: string;
  description: string;
  category: WidgetCategory;
  owner: string;
  version: string;
  defaultSize: WidgetSize;
}

export interface WidgetManifest {
  metadata: WidgetMetadata;
  layout: WidgetLayoutMetadata;
  capabilities: WidgetCapabilities;
}

export function createWidgetManifest(
  metadata: Omit<WidgetMetadata, "version" | "owner">,
  layout: Partial<WidgetLayoutMetadata>,
  capabilities: Partial<WidgetCapabilities>
): WidgetManifest {
  return {
    metadata: {
      owner: "System",
      version: "1.0.0",
      ...metadata,
    },
    layout: {
      minWidth: 1,
      minHeight: 1,
      defaultColumns: 4,
      defaultRows: 4,
      preferredAspectRatio: 1,
      allowResize: true,
      allowCollapse: true,
      allowFullscreen: true,
      ...layout,
    },
    capabilities: {
      supportsToolbar: true,
      supportsStatus: true,
      supportsActions: true,
      supportsHeader: true,
      supportsFooter: true,
      supportsLoading: true,
      supportsPlaceholder: true,
      supportsExportPlaceholder: true,
      ...capabilities,
    },
  };
}
