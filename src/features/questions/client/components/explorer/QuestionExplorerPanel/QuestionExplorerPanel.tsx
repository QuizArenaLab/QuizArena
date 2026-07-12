"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionExplorerPanelProps {
  children: ReactNode;
  width?: string;
  position?: "left" | "right" | "bottom" | "top";
  className?: string;
}

export function QuestionExplorerPanel({
  children,
  width = "w-64",
  position = "left",
  className = "",
}: QuestionExplorerPanelProps) {
  const getPositionClasses = () => {
    switch (position) {
      case "left":
        return "border-r border-gray-200 flex-col";
      case "right":
        return "border-l border-gray-200 flex-col";
      case "bottom":
        return "border-t border-gray-200 flex-row h-64 w-full";
      case "top":
        return "border-b border-gray-200 flex-row h-64 w-full";
      default:
        return "border-r border-gray-200 flex-col";
    }
  };

  const dimensionClasses = position === "left" || position === "right" ? `${width} h-full` : "";

  return (
    <div
      className={`flex shrink-0 bg-gray-50 overflow-auto ${dimensionClasses} ${getPositionClasses()} ${className}`}
    >
      {children}
    </div>
  );
}

ComponentRegistry.register({
  id: "question-explorer-panel",
  name: "QuestionExplorerPanel",
  category: "question" as any,
  subtype: "explorer",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionExplorerPanel";
