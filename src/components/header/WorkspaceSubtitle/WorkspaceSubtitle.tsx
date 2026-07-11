"use client";

import React from "react";
import { WorkspaceSubtitleProps } from "./WorkspaceSubtitle.types";
import { ComponentRegistry } from "@/registry";
import { useHeaderPresentation, useHeaderResponsive } from "@/providers/HeaderProvider";

export function WorkspaceSubtitle({
  subtitle: propSubtitle,
  className = "",
}: WorkspaceSubtitleProps) {
  const { subtitle: contextSubtitle } = useHeaderPresentation();
  const { isCompact } = useHeaderResponsive();
  const displaySubtitle = propSubtitle ?? contextSubtitle;

  if (!displaySubtitle || isCompact) {
    return null;
  }

  return (
    <p className={`text-sm text-gray-500 truncate mt-0.5 ${className}`} title={displaySubtitle}>
      {displaySubtitle}
    </p>
  );
}

ComponentRegistry.register({
  id: "workspace-subtitle",
  name: "WorkspaceSubtitle",
  category: "header",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
