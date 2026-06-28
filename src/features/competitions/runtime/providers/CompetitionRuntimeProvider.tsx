"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { RuntimeHost } from "../core/RuntimeHost";
import type { RuntimeState } from "../types/runtime.types";
import type { WorkspaceInitPayload } from "@/types/competition-experience";

const RuntimeContext = createContext<RuntimeHost | null>(null);

export function CompetitionRuntimeProvider({
  children,
  payload,
}: {
  children: React.ReactNode;
  payload: WorkspaceInitPayload;
}) {
  // 1. Singleton Host instantiation
  const [host] = useState(() => new RuntimeHost());

  // 2. Hydrate local state for React tree
  const [state, setState] = useState<RuntimeState>(host.getState());

  useEffect(() => {
    const unsubscribe = host.subscribe(() => {
      setState(host.getState());
    });

    host.boot(payload);

    return () => {
      unsubscribe();
      host.destroy();
    };
  }, [host, payload]);

  // Provide host (for commands)
  return <RuntimeContext.Provider value={host}>{children}</RuntimeContext.Provider>;
}

// ─── Hooks ──────────────────────────────────────────────────────────────────

export function useRuntimeCommand() {
  const host = useContext(RuntimeContext);
  if (!host) {
    throw new Error("useRuntimeCommand must be used within CompetitionRuntimeProvider");
  }
  return {
    dispatch: (commandType: string, payload?: any) => {
      if (host.controller) {
        host.controller.commands.dispatch(commandType, payload);
      } else {
        console.warn(`[RuntimeProvider] Dropped command ${commandType}, controller not ready.`);
      }
    },
  };
}

export function useRuntimeState<T>(selector: (state: RuntimeState) => T): T {
  const host = useContext(RuntimeContext);
  if (!host) {
    throw new Error("useRuntimeState must be used within CompetitionRuntimeProvider");
  }

  const [localState, setLocalState] = useState(() => selector(host.getState()));

  useEffect(() => {
    let lastValue = selector(host.getState());

    const unsubscribe = host.subscribe(() => {
      const newValue = selector(host.getState());
      // Simple shallow compare or reference equality
      if (newValue !== lastValue) {
        lastValue = newValue;
        setLocalState(newValue);
      }
    });

    return unsubscribe;
  }, [host, selector]);

  return localState;
}

// Mobile Palette bypass hook
export function useMobilePaletteStore() {
  const host = useContext(RuntimeContext);
  if (!host) throw new Error("Out of context");

  return {
    showMobilePalette: host.getState().showMobilePalette,
    setShowMobilePalette: (show: boolean) => host.updateState({ showMobilePalette: show }),
  };
}
