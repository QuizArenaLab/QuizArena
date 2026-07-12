import { ChartCapabilities } from "./ChartCapabilities";
import { ChartVariant } from "../presentation/ChartVariant";
import { ChartInteractionMode } from "../presentation/ChartInteractionMode";
import { ChartLoadingStrategy } from "../presentation/ChartLoadingStrategy";
import { ChartAccessibility } from "../types/ChartAccessibility";

export interface ChartMetadata {
  id: string;
  name: string;
  description: string;
  owner: string;
  version: string;
  status: "draft" | "active" | "deprecated" | "archived";
}

export interface ChartLayoutMetadata {
  preferredAspectRatio: number;
  minWidth: number;
  minHeight: number;
  responsivePriority: "shrink" | "hide-legend" | "stack";
  defaultColumns: number;
}

export interface ChartPresentationMetadata {
  variant: ChartVariant;
  interactionMode: ChartInteractionMode;
  loadingStrategy: ChartLoadingStrategy;
}

export interface ChartManifest {
  metadata: ChartMetadata;
  capabilities: ChartCapabilities;
  presentation: ChartPresentationMetadata;
  accessibility: ChartAccessibility;
  layout: ChartLayoutMetadata;
}
