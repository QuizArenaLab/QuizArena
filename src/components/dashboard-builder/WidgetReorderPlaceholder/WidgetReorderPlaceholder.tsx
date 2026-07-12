"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";
import { Icon } from "@/icons/Icon";

export interface WidgetReorderPlaceholderProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  className?: string;
}

export function WidgetReorderPlaceholder({
  onMoveUp,
  onMoveDown,
  className = "",
}: WidgetReorderPlaceholderProps) {
  return (
    <div
      className={`absolute top-2 right-2 flex flex-col gap-1 bg-white border border-gray-200 shadow-sm rounded-md p-0.5 z-20 ${className}`}
    >
      <button
        className="p-0.5 rounded hover:bg-gray-100 hover:text-primary text-gray-500"
        onClick={(e) => {
          e.stopPropagation();
          onMoveUp?.();
        }}
        title="Move Up"
      >
        <Icon name="ArrowUp" className="w-3 h-3" />
      </button>
      <button
        className="p-0.5 rounded hover:bg-gray-100 hover:text-primary text-gray-500"
        onClick={(e) => {
          e.stopPropagation();
          onMoveDown?.();
        }}
        title="Move Down"
      >
        <Icon name="ArrowDown" className="w-3 h-3" />
      </button>
    </div>
  );
}

ComponentRegistry.register({
  id: "widget-reorder-placeholder",
  name: "WidgetReorderPlaceholder",
  category: "dashboard-builder" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./WidgetReorderPlaceholder";
