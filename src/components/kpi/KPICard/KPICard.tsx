import React, { ReactNode, useEffect } from "react";
import { KPIProvider } from "../../../providers/KPIProvider";
import { KPIPresentationMetadata, KPIManifest } from "../../../kpi";
import { KPIRegistry } from "../../../kpi/KPIRegistry";

export interface KPICardProps {
  manifest?: KPIManifest;
  presentation?: Partial<KPIPresentationMetadata>;
  children: ReactNode;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  manifest,
  presentation,
  children,
  className = "",
}) => {
  useEffect(() => {
    if (manifest) {
      KPIRegistry.register(manifest);
    }
  }, [manifest]);

  return (
    <KPIProvider presentation={presentation}>
      <article
        className={`qa-kpi-card flex flex-col bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] p-4 shadow-sm w-full h-full overflow-hidden ${className}`}
        role="region"
        aria-label={manifest?.metadata?.name || "KPI Card"}
      >
        {children}
      </article>
    </KPIProvider>
  );
};
