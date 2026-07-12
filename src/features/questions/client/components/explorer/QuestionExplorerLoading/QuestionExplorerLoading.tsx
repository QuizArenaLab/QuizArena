"use client";

import React from "react";
import { ComponentRegistry } from "@/registry";
import { Skeleton } from "@/components/primitives/Skeleton";

export interface QuestionExplorerLoadingProps {
  className?: string;
}

export function QuestionExplorerLoading({ className = "" }: QuestionExplorerLoadingProps) {
  return (
    <div className={`w-full h-full flex flex-col gap-4 p-6 ${className}`}>
      {/* Loading Skeleton simulating grid/list layout */}
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="w-48 h-8 rounded-lg" />
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

ComponentRegistry.register({
  id: "question-explorer-loading",
  name: "QuestionExplorerLoading",
  category: "question" as any,
  subtype: "explorer",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});

export * from "./QuestionExplorerLoading";
