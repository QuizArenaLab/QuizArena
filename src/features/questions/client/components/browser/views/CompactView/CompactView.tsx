"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface CompactViewProps {
  children: ReactNode;
  gap?: string;
  className?: string;
}

export function CompactView({ children, gap = "gap-1", className = "" }: CompactViewProps) {
  return (
    <div className={`flex flex-col ${gap} w-full divide-y divide-gray-100 ${className}`}>
      {children}
    </div>
  );
}

ComponentRegistry.register({
  id: "question-browser-compact-view",
  name: "CompactView",
  category: "question" as any,
  subtype: "view",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./CompactView";
