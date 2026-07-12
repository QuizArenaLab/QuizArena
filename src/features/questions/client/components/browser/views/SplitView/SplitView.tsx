"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface SplitViewProps {
  topContent?: ReactNode;
  bottomContent?: ReactNode;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  direction?: "horizontal" | "vertical";
  className?: string;
}

export function SplitView({
  topContent,
  bottomContent,
  leftContent,
  rightContent,
  direction = "horizontal",
  className = "",
}: SplitViewProps) {
  if (direction === "horizontal") {
    return (
      <div className={`flex w-full h-full divide-x divide-gray-200 ${className}`}>
        <div className="flex-1 overflow-auto p-4">{leftContent}</div>
        <div className="flex-1 overflow-auto p-4 bg-gray-50">{rightContent}</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col w-full h-full divide-y divide-gray-200 ${className}`}>
      <div className="flex-1 overflow-auto p-4">{topContent}</div>
      <div className="flex-1 overflow-auto p-4 bg-gray-50">{bottomContent}</div>
    </div>
  );
}

ComponentRegistry.register({
  id: "question-browser-split-view",
  name: "SplitView",
  category: "question" as any,
  subtype: "view",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./SplitView";
