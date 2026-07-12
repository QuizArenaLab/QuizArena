"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProviderRegistry } from "@/registry";
import { ActiveWorkspaceState } from "@/workspace-state";
import { IconName } from "@/icons/IconRegistry";

export interface WorkspaceStateContextValue {
  currentState: ActiveWorkspaceState;
  setCurrentState: (state: ActiveWorkspaceState) => void;

  variant: string; // The specific variant string depending on the active state
  setVariant: (variant: string) => void;

  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;

  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;

  illustration?: IconName;
  setIllustration: (icon?: IconName) => void;
}

const WorkspaceStateContext = createContext<WorkspaceStateContextValue | undefined>(undefined);

export function WorkspaceStateProvider({
  children,
  defaultState = "idle",
  defaultVariant = "",
  defaultCompactMode = false,
  defaultFullscreen = false,
}: {
  children: ReactNode;
  defaultState?: ActiveWorkspaceState;
  defaultVariant?: string;
  defaultCompactMode?: boolean;
  defaultFullscreen?: boolean;
}) {
  const [currentState, setCurrentState] = useState<ActiveWorkspaceState>(defaultState);
  const [variant, setVariant] = useState<string>(defaultVariant);
  const [compactMode, setCompactMode] = useState<boolean>(defaultCompactMode);
  const [fullscreen, setFullscreen] = useState<boolean>(defaultFullscreen);
  const [illustration, setIllustration] = useState<IconName | undefined>(undefined);

  return (
    <WorkspaceStateContext.Provider
      value={{
        currentState,
        setCurrentState,
        variant,
        setVariant,
        compactMode,
        setCompactMode,
        fullscreen,
        setFullscreen,
        illustration,
        setIllustration,
      }}
    >
      {children}
    </WorkspaceStateContext.Provider>
  );
}

export function useWorkspaceState() {
  const context = useContext(WorkspaceStateContext);
  if (!context) {
    throw new Error("useWorkspaceState must be used within a WorkspaceStateProvider");
  }
  return context;
}

ProviderRegistry.register({
  id: "workspace-state-provider",
  name: "WorkspaceStateProvider",
  description: "Provides granular presentation state for the Enterprise Workspace States Platform",
});
