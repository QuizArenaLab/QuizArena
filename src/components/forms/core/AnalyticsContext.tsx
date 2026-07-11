import React, { createContext, useContext, ReactNode } from "react";

export interface AnalyticsContextValue {
  sessionId: string;
  userId?: string;
  workspaceId?: string;
  tenantId?: string;
  deviceId?: string;
  locale?: string;
  timezone?: string;
  analyticsSource?: string;
}

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

export interface AnalyticsProviderProps {
  value: AnalyticsContextValue;
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ value, children }) => {
  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

export const useAnalyticsContext = (): AnalyticsContextValue => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalyticsContext must be used within an AnalyticsProvider");
  }
  return context;
};

export const useOptionalAnalyticsContext = (): AnalyticsContextValue | undefined => {
  return useContext(AnalyticsContext);
};
