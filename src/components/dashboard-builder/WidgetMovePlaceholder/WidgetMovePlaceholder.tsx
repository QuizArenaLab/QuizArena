"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";
import { Icon } from "@/icons/Icon";

export interface WidgetMovePlaceholderProps {
  onMoveStart?: () => void;
  className?: string;
}

export function WidgetMovePlaceholder({ onMoveStart, className = "" }: WidgetMovePlaceholderProps) {
  return (
    <div
      className={`absolute top-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-sm rounded-full p-1 cursor-grab active:cursor-grabbing hover:bg-gray-50 hover:text-primary text-gray-400 z-20 ${className}`}
      onMouseDown={(e) => {
        e.stopPropagation();
        onMoveStart?.();
      }}
      title="Drag to move"
    >
      <Icon name="GripHorizontal" className="w-4 h-4" />
    </div>
  );
}

ComponentRegistry.register({
  id: "widget-move-placeholder",
  name: "WidgetMovePlaceholder",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./WidgetMovePlaceholder";
