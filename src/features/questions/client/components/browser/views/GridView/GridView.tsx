"use client";

import React, { ReactNode } from "react";
import { ComponentRegistry } from "@/registry";

export interface GridViewProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: string;
  className?: string;
}

export function GridView({ children, columns = 3, gap = "gap-4", className = "" }: GridViewProps) {
  // A simple grid mapping based on columns
  const getGridCols = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4";
      case 5:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5";
      case 6:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6";
      default:
        return "grid-cols-3";
    }
  };

  return <div className={`grid ${getGridCols()} ${gap} w-full ${className}`}>{children}</div>;
}

ComponentRegistry.register({
  id: "question-browser-grid-view",
  name: "GridView",
  category: "question" as any,
  subtype: "view",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./GridView";
