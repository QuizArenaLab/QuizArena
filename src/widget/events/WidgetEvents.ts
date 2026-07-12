export interface WidgetEventPayload {
  widgetId: string;
  timestamp: number;
}

export interface WidgetRefreshEvent extends WidgetEventPayload {
  type: "REFRESH";
}

export interface WidgetCollapseEvent extends WidgetEventPayload {
  type: "COLLAPSE";
  isCollapsed: boolean;
}

export interface WidgetFullscreenEvent extends WidgetEventPayload {
  type: "FULLSCREEN";
  isFullscreen: boolean;
}

export type WidgetEvent = WidgetRefreshEvent | WidgetCollapseEvent | WidgetFullscreenEvent;
