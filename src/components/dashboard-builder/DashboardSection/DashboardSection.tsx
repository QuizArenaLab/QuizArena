"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";
import { useDashboardBuilder } from "@/providers/DashboardBuilderProvider";

export interface DashboardSectionProps {
  id: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function DashboardSection({
  id,
  title,
  description,
  children,
  className = "",
}: DashboardSectionProps) {
  const { mode } = useDashboardBuilder();
  const isEditMode = mode === "EDIT";

  return (
    <section
      className={`w-full flex flex-col gap-4 mb-8 ${isEditMode ? "p-4 border-2 border-transparent hover:border-gray-200 rounded-xl transition-colors" : ""} ${className}`}
      data-section-id={id}
    >
      {(title || description) && (
        <div className="flex flex-col gap-1 mb-2">
          {title && <h2 className="text-xl font-bold text-navy">{title}</h2>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}

      <div className="w-full flex-1">{children}</div>
    </section>
  );
}

ComponentRegistry.register({
  id: "dashboard-section",
  name: "DashboardSection",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./DashboardSection";
