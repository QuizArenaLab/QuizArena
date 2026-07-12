import React, { ReactNode, useMemo } from "react";
import { DashboardContext } from "../dashboard/DashboardContext";
import { DashboardLayoutMetadata } from "../dashboard/DashboardLayoutContract";
import { DashboardVariant } from "../dashboard/DashboardVariant";
import { DashboardSlot } from "../dashboard/DashboardSlot";

export interface DashboardProviderProps {
  layout?: Partial<DashboardLayoutMetadata>;
  children: ReactNode;
}

const DEFAULT_LAYOUT: DashboardLayoutMetadata = {
  variant: DashboardVariant.DEFAULT,
  defaultSlots: [DashboardSlot.HEADER, DashboardSlot.GRID, DashboardSlot.FOOTER],
  spacing: "var(--spacing-md)",
  columns: 12,
  compact: false,
  maxWidth: "100%",
};

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ layout, children }) => {
  const mergedLayout = useMemo(() => {
    return { ...DEFAULT_LAYOUT, ...layout };
  }, [layout]);

  return (
    <DashboardContext.Provider value={{ layout: mergedLayout }}>
      {children}
    </DashboardContext.Provider>
  );
};
