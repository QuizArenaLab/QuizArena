"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProviderRegistry } from "@/registry";

export interface HeaderPresentationState {
  title: string;
  subtitle?: string;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle?: string) => void;
}

export interface HeaderActionsState {
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  overflowActions?: ReactNode[];
  setPrimaryAction: (node?: ReactNode) => void;
  setSecondaryAction: (node?: ReactNode) => void;
  setOverflowActions: (nodes?: ReactNode[]) => void;
}

export interface HeaderResponsiveState {
  isCompact: boolean;
  setCompact: (compact: boolean) => void;
}

const HeaderPresentationContext = createContext<HeaderPresentationState | undefined>(undefined);
const HeaderActionsContext = createContext<HeaderActionsState | undefined>(undefined);
const HeaderResponsiveContext = createContext<HeaderResponsiveState | undefined>(undefined);

export function HeaderProvider({
  children,
  defaultTitle = "Workspace",
  defaultCompact = false,
}: {
  children: ReactNode;
  defaultTitle?: string;
  defaultCompact?: boolean;
}) {
  const [title, setTitle] = useState(defaultTitle);
  const [subtitle, setSubtitle] = useState<string | undefined>();

  const [primaryAction, setPrimaryAction] = useState<ReactNode | undefined>();
  const [secondaryAction, setSecondaryAction] = useState<ReactNode | undefined>();
  const [overflowActions, setOverflowActions] = useState<ReactNode[] | undefined>();

  const [isCompact, setCompact] = useState(defaultCompact);

  return (
    <HeaderPresentationContext.Provider value={{ title, subtitle, setTitle, setSubtitle }}>
      <HeaderActionsContext.Provider
        value={{
          primaryAction,
          secondaryAction,
          overflowActions,
          setPrimaryAction,
          setSecondaryAction,
          setOverflowActions,
        }}
      >
        <HeaderResponsiveContext.Provider value={{ isCompact, setCompact }}>
          {children}
        </HeaderResponsiveContext.Provider>
      </HeaderActionsContext.Provider>
    </HeaderPresentationContext.Provider>
  );
}

export function useHeaderPresentation() {
  const context = useContext(HeaderPresentationContext);
  if (!context) {
    throw new Error("useHeaderPresentation must be used within HeaderProvider");
  }
  return context;
}

export function useHeaderActions() {
  const context = useContext(HeaderActionsContext);
  if (!context) {
    throw new Error("useHeaderActions must be used within HeaderProvider");
  }
  return context;
}

export function useHeaderResponsive() {
  const context = useContext(HeaderResponsiveContext);
  if (!context) {
    return { isCompact: false, setCompact: () => {} };
  }
  return context;
}

ProviderRegistry.register({
  id: "header-provider",
  name: "HeaderProvider",
  description: "Provides granular context state for the Enterprise Header Platform",
});
