"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface ReadonlyViewProps {
  children: ReactNode;
  className?: string;
}

export function ReadonlyView({ children, className = "" }: ReadonlyViewProps) {
  return (
    <div className={`relative w-full h-full opacity-90 ${className}`}>
      <div
        className="absolute inset-0 z-50 pointer-events-auto cursor-not-allowed bg-transparent"
        title="Read-only mode"
      />
      {/* We allow scrolling by using a pointer-events-auto wrapper but blocking clicks */}
      <div className="w-full h-full pointer-events-none">{children}</div>
    </div>
  );
}

ComponentRegistry.register({
  id: "question-browser-readonly-view",
  name: "ReadonlyView",
  category: "question" as any,
  subtype: "view",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./ReadonlyView";
