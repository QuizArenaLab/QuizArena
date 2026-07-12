"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface QuestionExplorerProps {
  children: ReactNode; // Panels and Viewports
  className?: string;
}

export function QuestionExplorer({ children, className = "" }: QuestionExplorerProps) {
  return (
    <div
      className={`flex w-full h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

ComponentRegistry.register({
  id: "question-explorer",
  name: "QuestionExplorer",
  category: "question" as any,
  subtype: "explorer",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionExplorer";
