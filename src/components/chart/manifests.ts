import {
  ChartManifest,
  ChartVariant,
  ChartInteractionMode,
  ChartLoadingStrategy,
} from "../../chart";

export const createDefaultChartManifest = (
  id: string,
  name: string,
  description: string
): ChartManifest => ({
  metadata: {
    id,
    name,
    description,
    owner: "Platform",
    version: "1.0.0",
    status: "active",
  },
  capabilities: {
    supportsLegend: true,
    supportsTooltip: true,
    supportsMultipleSeries: true,
    supportsRealtime: true,
    supportsExport: true,
    supportsFullscreen: true,
    supportsComparison: false,
    supportsAnnotations: false,
  },
  presentation: {
    variant: ChartVariant.DEFAULT,
    interactionMode: ChartInteractionMode.HOVER,
    loadingStrategy: ChartLoadingStrategy.STATIC,
  },
  accessibility: {
    ariaLabel: "Chart",
    keyboardNavigation: true,
  },
  layout: {
    preferredAspectRatio: 16 / 9,
    minWidth: 300,
    minHeight: 200,
    responsivePriority: "shrink",
    defaultColumns: 1,
  },
});
