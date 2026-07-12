"use client";

import React, { ReactNode, useState, useCallback } from "react";
import { QuestionBrowserContext } from "../browser/QuestionBrowserContext";
import { QuestionBrowserState } from "../browser/QuestionBrowserState";
import { QuestionBrowserMode } from "../browser/QuestionBrowserMode";
import { QuestionBrowserView } from "../browser/QuestionBrowserView";
import { QuestionBrowserCapabilities } from "../browser/QuestionBrowserCapabilities";
import { ComponentRegistry } from "@/registry";

export interface QuestionBrowserProviderProps {
  children: ReactNode;
  initialMode?: QuestionBrowserMode;
  initialView?: QuestionBrowserView;
  capabilities?: Partial<QuestionBrowserCapabilities>;
}

const defaultCapabilities: QuestionBrowserCapabilities = {
  canSelect: true,
  canCompare: true,
  canPreview: true,
  canChangeView: true,
  canFilter: true,
  canSearch: true,
  canSort: true,
  canExport: false,
  canBulkEdit: false,
};

export function QuestionBrowserProvider({
  children,
  initialMode = QuestionBrowserMode.BROWSE,
  initialView = QuestionBrowserView.GRID,
  capabilities: customCapabilities = {},
}: QuestionBrowserProviderProps) {
  const [state, setState] = useState<QuestionBrowserState>({
    mode: initialMode,
    view: initialView,
    selectedIds: new Set(),
    hoveredId: null,
    previewId: null,
    comparisonIds: new Set(),
    loading: false,
    error: null,
  });

  const capabilities = { ...defaultCapabilities, ...customCapabilities };

  const setMode = useCallback((mode: QuestionBrowserMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const setView = useCallback(
    (view: QuestionBrowserView) => {
      if (capabilities.canChangeView) {
        setState((prev) => ({ ...prev, view }));
      }
    },
    [capabilities.canChangeView]
  );

  const toggleSelection = useCallback(
    (id: string) => {
      if (!capabilities.canSelect) return;
      setState((prev) => {
        const selectedIds = new Set(prev.selectedIds);
        if (selectedIds.has(id)) {
          selectedIds.delete(id);
        } else {
          selectedIds.add(id);
        }
        return { ...prev, selectedIds };
      });
    },
    [capabilities.canSelect]
  );

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selectedIds: new Set() }));
  }, []);

  const selectAll = useCallback(
    (ids: string[]) => {
      if (!capabilities.canSelect) return;
      setState((prev) => ({ ...prev, selectedIds: new Set(ids) }));
    },
    [capabilities.canSelect]
  );

  const setHovered = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, hoveredId: id }));
  }, []);

  const setPreview = useCallback(
    (id: string | null) => {
      if (capabilities.canPreview || id === null) {
        setState((prev) => ({
          ...prev,
          previewId: id,
          mode: id ? QuestionBrowserMode.PREVIEW : initialMode,
        }));
      }
    },
    [capabilities.canPreview, initialMode]
  );

  const toggleComparison = useCallback(
    (id: string) => {
      if (!capabilities.canCompare) return;
      setState((prev) => {
        const comparisonIds = new Set(prev.comparisonIds);
        if (comparisonIds.has(id)) {
          comparisonIds.delete(id);
        } else {
          comparisonIds.add(id);
        }
        return {
          ...prev,
          comparisonIds,
          mode: comparisonIds.size > 0 ? QuestionBrowserMode.COMPARE : QuestionBrowserMode.BROWSE,
        };
      });
    },
    [capabilities.canCompare]
  );

  const clearComparison = useCallback(() => {
    setState((prev) => ({
      ...prev,
      comparisonIds: new Set(),
      mode: prev.mode === QuestionBrowserMode.COMPARE ? QuestionBrowserMode.BROWSE : prev.mode,
    }));
  }, []);

  return (
    <QuestionBrowserContext.Provider
      value={{
        state,
        capabilities,
        setMode,
        setView,
        toggleSelection,
        clearSelection,
        selectAll,
        setHovered,
        setPreview,
        toggleComparison,
        clearComparison,
      }}
    >
      {children}
    </QuestionBrowserContext.Provider>
  );
}

ComponentRegistry.register({
  id: "question-browser-provider",
  name: "QuestionBrowserProvider",
  category: "question" as any,
  subtype: "provider",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionBrowserProvider";
