import React, { ReactNode, useMemo } from "react";
import {
  ChartPresentationContext,
  ChartPresentationContextValue,
} from "../chart/presentation/ChartPresentationContext";
import { ChartVariant } from "../chart/presentation/ChartVariant";
import { ChartInteractionMode } from "../chart/presentation/ChartInteractionMode";
import { ChartAnimation } from "../chart/presentation/ChartAnimation";
import { defaultChartTheme, ChartTheme } from "../chart/presentation/ChartTheme";
import { registerAllCharts } from "../components/chart/registerCharts";

export interface ChartProviderProps {
  presentation?: Partial<ChartPresentationContextValue>;
  children: ReactNode;
}

const DEFAULT_PRESENTATION: ChartPresentationContextValue = {
  variant: ChartVariant.DEFAULT,
  interactionMode: ChartInteractionMode.NONE,
  animation: ChartAnimation.FADE,
  theme: defaultChartTheme,
  compact: false,
  responsive: true,
};

export const ChartProvider: React.FC<ChartProviderProps> = ({ presentation, children }) => {
  const mergedPresentation = useMemo(() => {
    return { ...DEFAULT_PRESENTATION, ...presentation };
  }, [presentation]);

  // Ensure charts are registered on provider init to avoid module-load side effects
  useMemo(() => {
    registerAllCharts();
  }, []);

  return (
    <ChartPresentationContext.Provider value={mergedPresentation}>
      {children}
    </ChartPresentationContext.Provider>
  );
};
