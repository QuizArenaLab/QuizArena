"use client";

import React, { useState, useCallback } from "react";
import { WidgetContext } from "../widget/context/WidgetContext";
import { WidgetManifest } from "../widget/registry/WidgetManifest";
import { WidgetState } from "../widget/presentation/WidgetState";

export interface WidgetProviderProps {
  children: React.ReactNode;
  manifest: WidgetManifest;
  initialState?: WidgetState;
  onRefresh?: () => void;
}

export const WidgetProvider: React.FC<WidgetProviderProps> = ({
  children,
  manifest,
  initialState = WidgetState.READY,
  onRefresh,
}) => {
  const [state, setState] = useState<WidgetState>(initialState);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  return (
    <WidgetContext.Provider
      value={{
        manifest,
        state,
        isCollapsed,
        isFullscreen,
        toggleCollapse,
        toggleFullscreen,
        onRefresh,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};
