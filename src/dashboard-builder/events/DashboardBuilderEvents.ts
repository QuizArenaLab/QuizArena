import { DashboardBuilderMode } from "../types/DashboardBuilderMode";
import { DashboardLayoutDefinition } from "../types/DashboardLayoutDefinition";

export type DashboardBuilderEventType =
  | "WidgetSelected"
  | "WidgetHovered"
  | "LayoutChanged"
  | "EditModeToggled"
  | "MovePlaceholderClicked"
  | "ResizePlaceholderClicked"
  | "ReorderPlaceholderClicked";

export interface DashboardBuilderEventPayloads {
  WidgetSelected: { widgetId: string | null; timestamp: number };
  WidgetHovered: { widgetId: string | null; timestamp: number };
  LayoutChanged: { layout: DashboardLayoutDefinition; timestamp: number };
  EditModeToggled: { mode: DashboardBuilderMode; timestamp: number };
  MovePlaceholderClicked: { widgetId: string; timestamp: number };
  ResizePlaceholderClicked: { widgetId: string; timestamp: number };
  ReorderPlaceholderClicked: { widgetId: string; timestamp: number };
}
