export interface DashboardWidgetPlacement {
  id: string; // ID of the widget placement instance
  widgetId: string; // Ref to the actual Widget ID
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface DashboardZoneDefinition {
  id: string;
  name: string;
  gridArea?: string; // If using grid-template-areas
  placements: DashboardWidgetPlacement[];
  direction?: "row" | "column";
  flexWrap?: boolean;
}
