import { createContext, useContext } from "react";
import { DashboardLayoutMetadata } from "./DashboardLayoutContract";

export interface DashboardContextValue {
  layout: DashboardLayoutMetadata;
}

export const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export const useDashboardContext = (): DashboardContextValue => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }
  return context;
};
