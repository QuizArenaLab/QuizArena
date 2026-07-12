import React, { ReactNode, useEffect } from "react";
import { DashboardProvider } from "../../../providers/DashboardProvider";
import { DashboardLayoutMetadata } from "../../../dashboard/DashboardLayoutContract";
import { DashboardRegistry } from "../../../dashboard/DashboardRegistry";
import { DashboardManifest } from "../../../dashboard/DashboardManifest";

export interface DashboardProps {
  manifest?: DashboardManifest;
  layout?: Partial<DashboardLayoutMetadata>;
  children: ReactNode;
  className?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  manifest,
  layout,
  children,
  className = "",
}) => {
  useEffect(() => {
    if (manifest) {
      DashboardRegistry.register(manifest);
    }
  }, [manifest]);

  return (
    <DashboardProvider layout={layout}>
      <div
        className={`qa-dashboard w-full h-full flex flex-col ${className}`}
        role="main"
        aria-label={manifest?.metadata?.name || "Dashboard"}
      >
        {children}
      </div>
    </DashboardProvider>
  );
};
