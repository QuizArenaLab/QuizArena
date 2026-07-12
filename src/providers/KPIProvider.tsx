import React, { ReactNode, useMemo } from "react";
import { KPIContext } from "../kpi/KPIContext";
import { KPIPresentationMetadata } from "../kpi/KPIManifest";
import { KPIVariant } from "../kpi/KPIVariant";
import { KPISize } from "../kpi/KPISize";
import { KPIStatus } from "../kpi/KPIStatus";

export interface KPIProviderProps {
  presentation?: Partial<KPIPresentationMetadata>;
  children: ReactNode;
}

const DEFAULT_PRESENTATION: KPIPresentationMetadata = {
  variant: KPIVariant.DEFAULT,
  size: KPISize.MD,
  status: KPIStatus.DEFAULT,
  compact: false,
};

export const KPIProvider: React.FC<KPIProviderProps> = ({ presentation, children }) => {
  const mergedPresentation = useMemo(() => {
    return { ...DEFAULT_PRESENTATION, ...presentation };
  }, [presentation]);

  return (
    <KPIContext.Provider value={{ presentation: mergedPresentation }}>
      {children}
    </KPIContext.Provider>
  );
};
