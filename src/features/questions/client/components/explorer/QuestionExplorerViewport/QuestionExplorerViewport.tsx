"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionExplorerViewportProps {
  children: ReactNode;
  className?: string;
}

export function QuestionExplorerViewport({
  children,
  className = "",
}: QuestionExplorerViewportProps) {
  return (
    <div
      className={`flex-1 w-full h-full overflow-hidden bg-white relative flex flex-col ${className}`}
    >
      {children}
    </div>
  );
}

ComponentRegistry.register({
  id: "question-explorer-viewport",
  name: "QuestionExplorerViewport",
  category: "question" as any,
  subtype: "explorer",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionExplorerViewport";
