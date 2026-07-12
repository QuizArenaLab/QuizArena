"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";
import { WorkspacePlaceholder } from "@/components/workspace-state/WorkspacePlaceholder";

export interface QuestionBrowserPlaceholderProps {
  title?: string;
  description?: string;
  icon?: string;
  className?: string;
}

export function QuestionBrowserPlaceholder({
  title = "Ready to Browse",
  description = "Select a view or adjust filters to begin exploring the question bank.",
  icon = "LayoutGrid",
  className = "",
}: QuestionBrowserPlaceholderProps) {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-white ${className}`}>
      <WorkspacePlaceholder icon={icon as any} title={title} description={description} />
    </div>
  );
}

ComponentRegistry.register({
  id: "question-browser-placeholder",
  name: "QuestionBrowserPlaceholder",
  category: "question" as any,
  subtype: "browser",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionBrowserPlaceholder";
