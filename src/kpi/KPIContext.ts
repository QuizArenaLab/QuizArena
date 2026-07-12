import { createContext, useContext } from "react";
import { KPIPresentationMetadata } from "./KPIManifest";

export interface KPIContextValue {
  presentation: KPIPresentationMetadata;
}

export const KPIContext = createContext<KPIContextValue | undefined>(undefined);

export const useKPIContext = (): KPIContextValue => {
  const context = useContext(KPIContext);
  if (!context) {
    throw new Error("useKPIContext must be used within a KPIProvider");
  }
  return context;
};
