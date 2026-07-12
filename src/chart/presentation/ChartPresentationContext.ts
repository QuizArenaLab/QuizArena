import { createContext, useContext } from "react";
import { ChartVariant } from "./ChartVariant";
import { ChartInteractionMode } from "./ChartInteractionMode";
import { ChartAnimation } from "./ChartAnimation";
import { ChartTheme } from "./ChartTheme";

export interface ChartPresentationContextValue {
  variant: ChartVariant;
  interactionMode: ChartInteractionMode;
  animation: ChartAnimation;
  theme: ChartTheme;
  compact: boolean;
  responsive: boolean;
}

export const ChartPresentationContext = createContext<ChartPresentationContextValue | undefined>(
  undefined
);

export const useChartPresentationContext = (): ChartPresentationContextValue => {
  const context = useContext(ChartPresentationContext);
  if (!context) {
    throw new Error("useChartPresentationContext must be used within a ChartProvider");
  }
  return context;
};
