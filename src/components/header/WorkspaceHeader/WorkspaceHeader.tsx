"use client";

import React from "react";
import { WorkspaceHeaderProps } from "./WorkspaceHeader.types";
import { ComponentRegistry } from "@/registry";

export function WorkspaceHeader({ leftNode, rightNode, className = "" }: WorkspaceHeaderProps) {
  return (
    <div className={`flex flex-1 items-center justify-between min-w-0 gap-8 ${className}`}>
      <div className="flex flex-col min-w-0 flex-1">{leftNode}</div>
      <div className="flex items-center shrink-0 gap-3">{rightNode}</div>
    </div>
  );
}

ComponentRegistry.register({
  id: "workspace-header",
  name: "WorkspaceHeader",
  category: "header",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
