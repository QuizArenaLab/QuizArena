"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface ListViewProps {
  children: ReactNode;
  gap?: string;
  className?: string;
}

export function ListView({ children, gap = "gap-3", className = "" }: ListViewProps) {
  return <div className={`flex flex-col ${gap} w-full ${className}`}>{children}</div>;
}

ComponentRegistry.register({
  id: "question-browser-list-view",
  name: "ListView",
  category: "question" as any,
  subtype: "view",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./ListView";
