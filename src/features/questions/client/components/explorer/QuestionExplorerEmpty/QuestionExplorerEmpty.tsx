"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";
import { WorkspacePlaceholder } from "@/components/workspace-state/WorkspacePlaceholder";

export interface QuestionExplorerEmptyProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function QuestionExplorerEmpty({
  title = "No Questions Found",
  description = "Adjust your filters or search query to find what you're looking for.",
  action,
  className = "",
}: QuestionExplorerEmptyProps) {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 ${className}`}>
      <WorkspacePlaceholder icon="Search" title={title} description={description} action={action} />
    </div>
  );
}

ComponentRegistry.register({
  id: "question-explorer-empty",
  name: "QuestionExplorerEmpty",
  category: "question" as any,
  subtype: "explorer",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionExplorerEmpty";
