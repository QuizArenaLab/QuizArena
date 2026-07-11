"use client";

import React from "react";
import { WorkspaceTitleProps } from "./WorkspaceTitle.types";
import { ComponentRegistry } from "@/registry";
import { useHeaderPresentation, useHeaderResponsive } from "@/providers/HeaderProvider";

export function WorkspaceTitle({ title: propTitle, className = "" }: WorkspaceTitleProps) {
  const { title: contextTitle } = useHeaderPresentation();
  const { isCompact } = useHeaderResponsive();
  const displayTitle = propTitle ?? contextTitle;

  return (
    <h1
      className={`font-semibold text-navy truncate tracking-tight transition-all ${
        isCompact ? "text-lg" : "text-xl"
      } ${className}`}
      title={displayTitle}
    >
      {displayTitle}
    </h1>
  );
}

ComponentRegistry.register({
  id: "workspace-title",
  name: "WorkspaceTitle",
  category: "header",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
