"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProviderRegistry } from "@/registry";
import { ResponsiveBreakpoint } from "@/layouts/workspace/ResponsiveBreakpoint";

export enum WorkspaceLayoutState {
  DEFAULT = "DEFAULT",
  COMPACT = "COMPACT",
  EXPANDED = "EXPANDED",
  FOCUSED = "FOCUSED",
  FULLSCREEN = "FULLSCREEN",
}

interface WorkspaceMetadata {
  id: string;
  name: string;
  role?: string;
}

interface WorkspaceContextType {
  metadata: WorkspaceMetadata | null;
  setMetadata: (metadata: WorkspaceMetadata | null) => void;

  layout: WorkspaceLayoutState;
  setLayout: React.Dispatch<React.SetStateAction<WorkspaceLayoutState>>;

  responsive: ResponsiveBreakpoint;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const getBreakpoint = (width: number): ResponsiveBreakpoint => {
  if (width < 640) return ResponsiveBreakpoint.SmallMobile;
  if (width < 768) return ResponsiveBreakpoint.Mobile;
  if (width < 1024) return ResponsiveBreakpoint.Tablet;
  if (width < 1280) return ResponsiveBreakpoint.Laptop;
  return ResponsiveBreakpoint.Desktop;
};

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [metadata, setMetadata] = useState<WorkspaceMetadata | null>(null);
  const [layout, setLayout] = useState<WorkspaceLayoutState>(WorkspaceLayoutState.DEFAULT);
  const [responsive, setResponsive] = useState<ResponsiveBreakpoint>(ResponsiveBreakpoint.Desktop);

  useEffect(() => {
    const handleResize = () => {
      setResponsive(getBreakpoint(window.innerWidth));
    };

    // Initial setting
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        metadata,
        setMetadata,
        layout,
        setLayout,
        responsive,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return context;
}

ProviderRegistry.register({
  id: "workspace-provider",
  name: "WorkspaceProvider",
  description: "Global provider for active workspace context, layout state, and responsive breakpoints.",
});
