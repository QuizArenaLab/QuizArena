"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";

export interface WidgetResizePlaceholderProps {
  onResizeStart?: (direction: "se" | "sw" | "ne" | "nw") => void;
  className?: string;
}

export function WidgetResizePlaceholder({
  onResizeStart,
  className = "",
}: WidgetResizePlaceholderProps) {
  return (
    <>
      <div
        className={`absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-20 bg-primary/20 hover:bg-primary rounded-br-xl transition-colors ${className}`}
        onMouseDown={(e) => {
          e.stopPropagation();
          onResizeStart?.("se");
        }}
        title="Resize"
      />
    </>
  );
}

ComponentRegistry.register({
  id: "widget-resize-placeholder",
  name: "WidgetResizePlaceholder",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./WidgetResizePlaceholder";
