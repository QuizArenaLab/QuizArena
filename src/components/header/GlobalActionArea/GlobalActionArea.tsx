"use client";

import React from "react";
import { GlobalActionAreaProps } from "./GlobalActionArea.types";
import { ComponentRegistry } from "@/registry";

export function GlobalActionArea({ children, className = "" }: GlobalActionAreaProps) {
  if (!children) return null;

  return (
    <div className={`flex items-center gap-2 px-2 border-l border-gray-100 ml-2 ${className}`}>
      {children}
    </div>
  );
}

ComponentRegistry.register({
  id: "global-action-area",
  name: "GlobalActionArea",
  category: "header",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
