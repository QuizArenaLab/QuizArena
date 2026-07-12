import React, { createContext, useContext } from "react";
import { WidgetState } from "../presentation/WidgetState";
import { WidgetManifest } from "../registry/WidgetManifest";

export interface WidgetContextValue {
  manifest: WidgetManifest;
  state: WidgetState;
  isCollapsed: boolean;
  isFullscreen: boolean;
  toggleCollapse: () => void;
  toggleFullscreen: () => void;
  onRefresh?: () => void;
}

export const WidgetContext = createContext<WidgetContextValue | undefined>(undefined);

export const useWidget = (): WidgetContextValue => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetContext.Provider");
  }
  return context;
};
